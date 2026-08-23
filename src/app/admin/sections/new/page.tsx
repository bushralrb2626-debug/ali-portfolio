import { createSection } from "@/app/admin/actions";
import { SectionForm } from "@/components/admin/SectionForm";
import Link from "next/link";

export default async function NewSectionPage() {
  return (
    <div>
      <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-200">
        Back
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">Add section</h1>
      <div className="mt-8">
        <SectionForm action={createSection} submitLabel="Create section" />
      </div>
    </div>
  );
}
