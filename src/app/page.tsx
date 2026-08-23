import { PublicSection } from "@/components/site/SectionView";
import { SiteShell } from "@/components/site/SiteShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const sections = await prisma.section.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
  const brand =
    sections.find((section) => section.type === "hero")?.title ?? "Ali";

  return (
    <SiteShell brand={brand}>
      {sections.length === 0 ? (
        <p className="py-32 text-center text-zinc-500">Coming soon.</p>
      ) : (
        sections.map((section) => (
          <PublicSection key={section.id} section={section} />
        ))
      )}
    </SiteShell>
  );
}
