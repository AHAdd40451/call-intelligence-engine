import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-[#ffffff14] bg-[#1a1a24] px-3 py-1 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:border-[#6366f1]/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
