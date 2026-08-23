import { EditableSite } from "@/components/editor/EditableSite";
import { parseItems } from "@/lib/section-items";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  await requireAdmin();
  const rows = await prisma.section.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <EditableSite
      initialSections={rows.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        subtitle: row.subtitle,
        body: row.body,
        imageUrl: row.imageUrl,
        items: parseItems(row.items),
        sortOrder: row.sortOrder,
        visible: row.visible,
      }))}
    />
  );
}
