import {
  createAppointmentSlot,
  deleteAppointmentSlot,
} from "@/app/admin/actions";
import { formatSlotTime } from "@/lib/appointments";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSlotsPage() {
  const slots = await prisma.appointmentSlot.findMany({
    orderBy: { startsAt: "asc" },
    include: { booking: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-100">Appointment slots</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Add a date and time. Visitors see open slots after Contact and can book one.
      </p>

      <form action={createAppointmentSlot} className="mt-8 flex max-w-xl flex-col gap-3">
        <label className="text-sm text-zinc-300">
          Date and time
          <input
            name="startsAt"
            type="datetime-local"
            required
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
          />
        </label>
        <label className="text-sm text-zinc-300">
          Label (optional)
          <input
            name="label"
            maxLength={80}
            placeholder="Call / campus visit"
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
          />
        </label>
        <button
          type="submit"
          className="self-start rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950"
        >
          Add slot
        </button>
      </form>

      {slots.length === 0 ? (
        <p className="mt-10 text-sm text-zinc-500">No slots yet.</p>
      ) : (
        <ul className="mt-10 space-y-3">
          {slots.map((slot) => (
            <li
              key={slot.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-5 py-4"
            >
              <div>
                <p className="font-medium text-zinc-100">{formatSlotTime(slot.startsAt)}</p>
                {slot.label ? (
                  <p className="text-xs text-zinc-500">{slot.label}</p>
                ) : null}
                {slot.booking ? (
                  <p className="mt-1 text-sm text-cyan-300">
                    Booked by {slot.booking.name} · {slot.booking.email}
                    {slot.booking.note ? ` · ${slot.booking.note}` : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-zinc-500">Open</p>
                )}
              </div>
              <form action={deleteAppointmentSlot}>
                <input type="hidden" name="id" value={slot.id} />
                <button type="submit" className="text-sm text-red-300 hover:underline">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
