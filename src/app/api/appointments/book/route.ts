import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { slotId?: string; name?: string; email?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slotId = String(body.slotId ?? "").trim();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const note = String(body.note ?? "").trim();

  if (!slotId || !name || !email || name.length > 120 || email.length > 200 || note.length > 500) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const slot = await prisma.appointmentSlot.findUnique({ where: { id: slotId } });
  if (!slot || !slot.open || slot.startsAt <= new Date()) {
    return NextResponse.json({ error: "That time is no longer open." }, { status: 409 });
  }

  try {
    await prisma.appointmentBooking.create({
      data: { slotId, name, email, note },
    });
    await prisma.appointmentSlot.update({
      where: { id: slotId },
      data: { open: false },
    });
  } catch {
    return NextResponse.json({ error: "That time was just taken." }, { status: 409 });
  }

  revalidatePath("/");
  revalidatePath("/admin/slots");
  return NextResponse.json({ ok: true });
}
