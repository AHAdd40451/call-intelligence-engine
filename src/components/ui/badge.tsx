import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#6366f1]/10 text-[#a5a6f6] border-[#6366f1]/20",
        secondary: "bg-[#ffffff0a] text-zinc-300 border-[#ffffff14]",
        success: "bg-green-500/10 text-green-400 border-green-500/20",
        destructive: "bg-red-500/10 text-red-400 border-red-500/20",
        warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        outline: "bg-transparent text-zinc-300 border-[#ffffff1a]",
        violet: "bg-[#8b5cf6]/10 text-[#c4b5fd] border-[#8b5cf6]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
