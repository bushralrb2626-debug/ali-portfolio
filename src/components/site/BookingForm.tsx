"use client";

import { useEffect, useState } from "react";
import type { OpenSlot } from "@/lib/appointments";

export function BookingForm() {
  const [slots, setSlots] = useState<OpenSlot[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "sending" | "sent" | "error">(
    "loading",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data: { slots?: OpenSlot[] }) => {
        setSlots(data.slots ?? []);
        setStatus("idle");
      })
      .catch(() => {
        setStatus("error");
        setError("Could not load times.");
      });
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const slotId = String(data.get("slotId") ?? "");
    setStatus("sending");
    setError("");
    const response = await fetch("/api/appointments/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId,
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        note: String(data.get("note") ?? ""),
      }),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setError(payload.error || "Could not book. Try another time.");
      return;
    }
    form.reset();
    setSlots((current) => current.filter((slot) => slot.id !== slotId));
    setStatus("sent");
  }

  if (status === "loading") {
    return <p className="mt-8 text-sm text-cyan-200/50">Loading times…</p>;
  }

  if (slots.length === 0 && status !== "sent") {
    return (
      <p className="mt-8 text-sm text-cyan-200/50">
        No open times yet. Send a message above, or check back after Ali posts slots.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-4">
      <fieldset className="space-y-2">
        <legend className="text-xs uppercase tracking-[0.16em] text-cyan-500/80">
          Open times
        </legend>
        {slots.map((slot) => (
          <label
            key={slot.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-cyan-400/20 bg-cyan-950/40 px-3 py-2 text-sm text-cyan-50"
          >
            <input type="radio" name="slotId" value={slot.id} required className="mt-1" />
            <span>
              {slot.display}
              {slot.label ? (
                <span className="mt-0.5 block text-xs text-cyan-200/50">{slot.label}</span>
              ) : null}
            </span>
          </label>
        ))}
      </fieldset>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-cyan-500/80">Name</span>
        <input
          name="name"
          required
          maxLength={120}
          className="mt-1 w-full rounded-xl border border-cyan-400/20 bg-cyan-950/40 px-3 py-2 text-sm text-cyan-50 outline-none focus:border-cyan-300/50"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-cyan-500/80">Email</span>
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          className="mt-1 w-full rounded-xl border border-cyan-400/20 bg-cyan-950/40 px-3 py-2 text-sm text-cyan-50 outline-none focus:border-cyan-300/50"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-cyan-500/80">
          Note (optional)
        </span>
        <textarea
          name="note"
          rows={3}
          maxLength={500}
          className="mt-1 w-full rounded-xl border border-cyan-400/20 bg-cyan-950/40 px-3 py-2 text-sm text-cyan-50 outline-none focus:border-cyan-300/50"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="gradient-cta inline-flex rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {status === "sending" ? "Booking…" : "Book this time"}
      </button>
      {status === "sent" ? (
        <p className="text-sm text-cyan-200/70">Booked. Ali has your time.</p>
      ) : null}
      {status === "error" && error ? (
        <p className="text-sm text-red-300/80">{error}</p>
      ) : null}
    </form>
  );
}
