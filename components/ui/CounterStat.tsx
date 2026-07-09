"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface CounterStatProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  className?: string;
  light?: boolean;
}

export default function CounterStat({
  end,
  suffix = "",
  prefix = "",
  label,
  duration = 2,
  className,
  light = false,
}: CounterStatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration,
          ease: "power2.out",
          onUpdate: () => setCount(Math.round(obj.val)),
        });
      },
    });

    return () => trigger.kill();
  }, [end, duration]);

  return (
    <div ref={ref} className={cn("text-center", className)}>
      <div
        className={cn(
          "font-display font-bold tracking-tight",
          light ? "text-[var(--surface)]" : "text-[var(--ink)]"
        )}
        style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1 }}
      >
        {prefix}{count}{suffix}
      </div>
      <div
        className={cn(
          "mt-2 text-xs uppercase tracking-[0.2em] font-semibold",
          light ? "text-[var(--stone)]" : "text-[var(--muted-ink)]"
        )}
      >
        {label}
      </div>
    </div>
  );
}
