import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-lime text-midnight shadow-[0_8px_30px_-8px_rgba(215,243,107,0.7)] hover:-translate-y-0.5 hover:bg-[#e4ff80] hover:shadow-[0_14px_36px_-8px_rgba(215,243,107,0.85)]",
        glass: "glass text-ivory hover:-translate-y-0.5 hover:bg-white/15",
        outline:
          "border border-midnight/20 bg-transparent text-midnight hover:-translate-y-0.5 hover:bg-midnight/5",
        emerald:
          "bg-emerald text-white shadow-[0_10px_30px_-10px_rgba(47,118,90,0.8)] hover:-translate-y-0.5 hover:bg-[#276349]",
        dark: "bg-midnight text-ivory hover:-translate-y-0.5 hover:bg-charcoal",
        whatsapp:
          "bg-whatsapp text-midnight shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] hover:-translate-y-0.5 hover:bg-[#3ee27b]",
        coffee:
          "bg-[#ffdd00] text-midnight shadow-[0_10px_30px_-10px_rgba(255,221,0,0.6)] hover:-translate-y-0.5 hover:bg-[#ffe84d]",
        ghost: "text-current hover:bg-current/10",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...(asChild ? {} : { type: type ?? "button" })}
      {...props}
    />
  );
}
