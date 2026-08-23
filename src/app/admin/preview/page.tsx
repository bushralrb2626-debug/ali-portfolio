import { EditableSite } from "@/components/editor/EditableSite";
import { parseItems } from "@/lib/section-items";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  let rows: Awaited<ReturnType<typeof prisma.section.findMany>> = [];
  try {
    rows = await prisma.section.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    rows = [];
  }

  return (
    <>
      <p className="sr-only">Visual editor</p>
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
    </>
  );
}
