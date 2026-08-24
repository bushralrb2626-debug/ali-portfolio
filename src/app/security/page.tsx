import { SiteShell } from "@/components/site/SiteShell";
import { SECURITY_RECOVERY, SECURITY_ROWS } from "@/lib/security-pitch";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security — Ali",
  description:
    "How Ali locks down AI-built campus sites, and what happens if a site is still hit.",
};

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const hero = await prisma.section.findFirst({
    where: { type: "hero" },
    select: { title: true },
  });
  const brand = hero?.title ?? "Ali";

  return (
    <SiteShell brand={brand}>
      <section className="scroll-mt-20 py-20">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-400">
          Security
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-cyan-50 md:text-5xl">
          You may worry that if I use AI, the site can be hacked.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-cyan-100/55">
          Here is the security I will add. If it is still hit, here is how I lock it again.
        </p>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-cyan-500/20">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-cyan-950/60 text-xs uppercase tracking-[0.12em] text-cyan-400/80">
              <tr>
                <th className="px-4 py-3 font-medium">Google Security Principle</th>
                <th className="px-4 py-3 font-medium">My Implementation</th>
                <th className="px-4 py-3 font-medium">Tools Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10 text-cyan-100/70">
              {SECURITY_ROWS.map((row) => (
                <tr key={row.principle}>
                  <td className="px-4 py-3 font-medium text-cyan-50">
                    {row.principle}
                  </td>
                  <td className="px-4 py-3">{row.implementation}</td>
                  <td className="px-4 py-3 text-cyan-200/80">{row.tools}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-16 text-2xl font-semibold tracking-tight text-cyan-50">
          If it is hacked
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-sm leading-relaxed text-cyan-100/60">
          {SECURITY_RECOVERY.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </SiteShell>
  );
}
