import { cn } from "@/lib/utils";

/** Original minimal knight mark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-8", className)} role="img" aria-label="Zugzwang knight logo">
      <rect width="48" height="48" rx="14" fill="#2F765A" />
      <path
        fill="#F7F4EC"
        d="M13 38v-3c0-6 4.5-9 8-13-3 0-5.500 1.500-8 4l-3-2c0-4 5-11 10-14l1-4 4 3c8 0 12 7 12 16 0 4-1.500 8-3 13z"
      />
      <circle cx="26" cy="16" r="1.800" fill="#2F765A" />
      <path d="M11 39.500h26" stroke="#D7F36B" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWord && (
        <span className="font-heading text-lg font-bold tracking-[0.18em]">ZUGZWANG</span>
      )}
    </span>
  );
}
