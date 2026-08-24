"use client";

import Link from "next/link";
import { TypeLine } from "@/components/site/TypeLine";

function brandLabel(name?: string) {
  const trimmed = (name ?? "Ali").trim();
  return trimmed.replace(/\.$/, "") || "Ali";
}

export function SiteHeader({
  brand,
  animate = true,
}: {
  brand?: string;
  animate?: boolean;
}) {
  const label = brandLabel(brand);
  return (
    <header className="sticky top-0 z-20 border-b border-cyan-500/10 bg-[#05080c]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="nano-orb inline-flex h-6 w-6 items-center justify-center rounded-full">
            <span className="h-2 w-2 rounded-full bg-white/90" />
          </span>
          {animate ? (
            <TypeLine
              text={label}
              className="text-sm font-medium tracking-tight text-cyan-50"
              msPerChar={80}
            />
          ) : (
            <span className="text-sm font-medium tracking-tight text-cyan-50">
              {label}
            </span>
          )}
        </Link>
        <nav className="flex items-center gap-7 text-[13px] text-cyan-200/50">
          <a href="/#about" className="hover:text-cyan-100">
            About
          </a>
          <a href="/#campus-stack" className="hover:text-cyan-100">
            Site
          </a>
          <a href="/#evidence" className="hover:text-cyan-100">
            Proof
          </a>
          <a href="/#projects" className="hover:text-cyan-100">
            Work
          </a>
          <a href="/#why-ai" className="hover:text-cyan-100">
            Why AI
          </a>
          <Link href="/security" className="hover:text-cyan-100">
            Security
          </Link>
          <a href="/#contact" className="hover:text-cyan-100">
            Contact
          </a>
          <a href="/#book" className="hover:text-cyan-100">
            Book
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ brand }: { brand?: string }) {
  const label = brandLabel(brand);
  return (
    <footer className="border-t border-cyan-500/10 px-6 py-10 text-center text-xs text-cyan-900">
      © {new Date().getFullYear()} {label}. Ads · AI video · solo ops.
      {" · "}
      <Link href="/security" className="text-cyan-700 hover:text-cyan-400">
        Security
      </Link>
    </footer>
  );
}
