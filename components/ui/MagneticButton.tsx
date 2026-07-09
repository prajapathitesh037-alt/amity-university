"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function MagneticButton({
  children,
  className,
  onClick,
  variant = "primary",
  size = "md",
  href,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = buttonRef.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
    if (contentRef.current) {
      contentRef.current.style.transform = "translate(0, 0)";
    }
  }, []);

  const baseClasses = cn(
    "relative inline-flex items-center justify-center rounded-full font-display font-semibold uppercase tracking-[0.14em] transition-all duration-500 ease-[var(--ease-amity)] overflow-hidden group",
    {
      "bg-[var(--maroon)] text-[var(--surface)] hover:bg-[var(--gold)] hover:text-[var(--ink)]":
        variant === "primary",
      "border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--surface)]":
        variant === "secondary",
      "text-[var(--ink)] hover:text-[var(--maroon)]":
        variant === "ghost",
    },
    {
      "px-5 py-2.5 text-[10px]": size === "sm",
      "px-8 py-3.5 text-[11px]": size === "md",
      "px-10 py-4 text-xs": size === "lg",
    },
    className
  );

  const inner = (
    <>
      <span ref={contentRef} className="relative z-10 transition-transform duration-500 ease-[var(--ease-amity)]">
        {children}
      </span>
      <span className="absolute inset-0 rounded-full bg-[var(--gold)] scale-0 group-hover:scale-100 transition-transform duration-700 ease-[var(--ease-out-amity)] origin-center -z-0" />
    </>
  );

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={baseClasses}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      className={baseClasses}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {inner}
    </button>
  );
}
