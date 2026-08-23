import { updateSection } from "@/app/admin/actions";
import { SectionForm } from "@/components/admin/SectionForm";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { itemsToText } from "@/lib/section-items";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const section = await prisma.section.findUnique({ where: { id } });
  if (!section) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-200">
        Back
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">Edit section</h1>
      <div className="mt-8">
        <SectionForm
          action={updateSection}
          submitLabel="Save changes"
          defaultValues={{
            id: section.id,
            type: section.type,
            title: section.title,
            subtitle: section.subtitle,
            body: section.body,
            itemsText: itemsToText(section.type, section.items),
            visible: section.visible,
          }}
        />
      </div>
    </div>
  );
}
