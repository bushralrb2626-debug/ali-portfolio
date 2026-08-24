import { formatSlotTime } from "@/lib/appointments";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();
  const slots = await prisma.appointmentSlot.findMany({
    where: { open: true, startsAt: { gt: now } },
    orderBy: { startsAt: "asc" },
  });

  return NextResponse.json({
    slots: slots.map((slot) => ({
      id: slot.id,
      startsAt: slot.startsAt.toISOString(),
      label: slot.label,
      display: formatSlotTime(slot.startsAt),
    })),
  });
}
