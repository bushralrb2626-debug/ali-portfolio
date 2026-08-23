import {
  deleteSection,
  moveSection,
  toggleSection,
} from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await requireAdmin();
  const sections = await prisma.section.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Sections</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Fallback list. Drag, drop photos, and edit text in the visual editor.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/preview"
            className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-300"
          >
            Visual editor
          </Link>
          <Link
            href="/admin/sections/new"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm"
          >
            Add section
          </Link>
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {sections.map((section, index) => (
          <li
            key={section.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3"
          >
            <div>
              <p className="font-medium">{section.title}</p>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                {section.type}
                {section.visible ? "" : " · hidden"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <form action={moveSection}>
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={index === 0}
                  className="rounded-md border border-zinc-700 px-2 py-1 disabled:opacity-30"
                >
                  Up
                </button>
              </form>
              <form action={moveSection}>
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={index === sections.length - 1}
                  className="rounded-md border border-zinc-700 px-2 py-1 disabled:opacity-30"
                >
                  Down
                </button>
              </form>
              <form action={toggleSection}>
                <input type="hidden" name="id" value={section.id} />
                <button
                  type="submit"
                  className="rounded-md border border-zinc-700 px-2 py-1"
                >
                  {section.visible ? "Hide" : "Show"}
                </button>
              </form>
              <Link
                href={`/admin/sections/${section.id}`}
                className="rounded-md border border-zinc-700 px-2 py-1"
              >
                Edit
              </Link>
              <form action={deleteSection}>
                <input type="hidden" name="id" value={section.id} />
                <button
                  type="submit"
                  className="rounded-md border border-red-900 px-2 py-1 text-red-300"
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
