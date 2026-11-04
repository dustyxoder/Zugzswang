import * as React from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-2xl border border-midnight/15 bg-white px-4 text-[15px] text-midnight shadow-sm transition placeholder:text-midnight/45 focus:border-emerald focus:outline-none focus:ring-4 focus:ring-emerald/20 aria-[invalid=true]:border-red-600";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(field, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(field, "min-h-28 py-3", className)} {...props} />;
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(field, "h-12 cursor-pointer", className)} {...props} />;
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-sm font-semibold text-midnight", className)} {...props} />;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}
