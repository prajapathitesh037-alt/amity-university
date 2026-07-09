"use client";

import { cn } from "@/lib/utils";

interface SectionLabelProps {
  text: string;
  className?: string;
  light?: boolean;
}

export default function SectionLabel({ text, className, light = false }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div
        className={cn(
          "w-8 h-[1px]",
          light ? "bg-[var(--stone)]" : "bg-[var(--gold)]"
        )}
      />
      <span
        className={cn(
          "text-section-label",
          light ? "text-[var(--stone)]" : "text-[var(--muted-ink)]"
        )}
      >
        {text}
      </span>
    </div>
  );
}
