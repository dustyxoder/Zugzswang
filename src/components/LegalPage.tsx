import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="on-light min-h-dvh bg-ivory">
      <header className="bg-midnight py-6 text-ivory">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5">
          <Link href="/" aria-label="ZUGZWANG home"><Logo /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-lime hover:underline">
            <ArrowLeft className="size-4" aria-hidden /> Back to site
          </Link>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-midnight/60">Last updated: {updated}</p>
        <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-midnight/85 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-midnight [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:font-semibold [&_a]:text-emerald [&_a]:underline">
          {children}
        </div>
      </main>
    </div>
  );
}
