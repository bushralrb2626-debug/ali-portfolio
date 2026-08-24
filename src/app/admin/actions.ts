"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SECTION_TYPES, textToItemsJson } from "@/lib/section-items";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/preview");
  revalidatePath("/admin/messages");
}

function readSectionFields(formData: FormData) {
  const type = String(formData.get("type") ?? "custom");
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const itemsText = String(formData.get("items") ?? "");
  const visible = formData.get("visible") === "on";

  if (!SECTION_TYPES.includes(type as (typeof SECTION_TYPES)[number])) {
    throw new Error("Invalid section type");
  }
  if (!title) {
    throw new Error("Title is required");
  }

  return {
    type,
    title,
    subtitle,
    body,
    items: textToItemsJson(type, itemsText),
    visible,
  };
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/admin/preview",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=1");
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/preview" });
}

export async function createSection(formData: FormData) {
  const data = readSectionFields(formData);
  const last = await prisma.section.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.section.create({
    data: {
      ...data,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });

  revalidateSite();
  redirect("/admin");
}

export async function updateSection(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const data = readSectionFields(formData);

  await prisma.section.update({
    where: { id },
    data,
  });

  revalidateSite();
  redirect("/admin");
}

export async function deleteSection(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await prisma.section.delete({ where: { id } });
  revalidateSite();
}

export async function toggleSection(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const section = await prisma.section.findUnique({ where: { id } });
  if (!section) {
    return;
  }
  await prisma.section.update({
    where: { id },
    data: { visible: !section.visible },
  });
  revalidateSite();
}

export async function moveSection(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const sections = await prisma.section.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const index = sections.findIndex((section) => section.id === id);
  if (index < 0) {
    return;
  }

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= sections.length) {
    return;
  }

  const current = sections[index];
  const neighbor = sections[swapWith];

  await prisma.$transaction([
    prisma.section.update({
      where: { id: current.id },
      data: { sortOrder: neighbor.sortOrder },
    }),
    prisma.section.update({
      where: { id: neighbor.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);

  revalidateSite();
}

export async function patchSection(
  id: string,
  data: {
    title?: string;
    subtitle?: string;
    body?: string;
    imageUrl?: string;
    itemsJson?: string;
  },
) {
  await prisma.section.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.subtitle !== undefined ? { subtitle: data.subtitle } : {}),
      ...(data.body !== undefined ? { body: data.body } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      ...(data.itemsJson !== undefined ? { items: data.itemsJson } : {}),
    },
  });
  revalidateSite();
}

export async function reorderSections(ids: string[]) {
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.section.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
  revalidateSite();
}

export async function createQuickSection() {
  const last = await prisma.section.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  const section = await prisma.section.create({
    data: {
      type: "custom",
      title: "New section",
      subtitle: "",
      body: "Click to edit this text.",
      imageUrl: "",
      items: "[]",
      sortOrder: (last?.sortOrder ?? -1) + 1,
      visible: true,
    },
  });
  revalidateSite();
  return section.id;
}
