import React from "react";
import { cn } from "../../lib/utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-16 animate-rainbow cursor-pointer items-center justify-center rounded-2xl border-0",
        "bg-[length:200%] px-10 py-4 font-bold text-lg transition-colors",
        "[background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.12rem*1)_solid_transparent]",
        
        // Before pseudo-element for the glow effect
        "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow",
        "before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-2)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-5)))]",
        "before:bg-[length:200%] before:[filter:blur(calc(0.8rem*1))]",
        
        // Light mode background layers
        "bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,transparent),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-2)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-5)))] text-black",
        
        // Dark mode background layers
        "dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,transparent),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-2)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-5)))] dark:text-white",
        
        "hover:scale-105 active:scale-95 transition-transform duration-300",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
         {children}
      </span>
    </button>
  );
}
