"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLenis } from "@/lib/lenis";

const NAV_ITEMS = [
  { label: "Amity", href: "#hero" },
  { label: "Mission", href: "#mission" },
  { label: "Schools", href: "#schools" },
  { label: "Legacy", href: "#legacy" },
  { label: "Campus Life", href: "#campus-life" },
  { label: "Admissions", href: "#admissions" },
  { label: "Apply", href: "#apply" },
];

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
      const sections = NAV_ITEMS.map((n) => n.href.replace("#", ""));
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 2 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <motion.nav
      ref={navRef}
      id="floating-nav"
      role="navigation"
      aria-label="Main navigation"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* Desktop pill nav */}
      <div className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full glass-warm shadow-[0_4px_32px_rgba(122,31,43,0.08)]">
        <button
          onClick={() => handleNavClick("#hero")}
          className="flex items-center justify-center w-8 h-8 mr-2 rounded-full hover:bg-[rgba(201,154,70,0.12)] transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-80">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--maroon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.href}
            onClick={() => handleNavClick(item.href)}
            className={cn(
              "relative px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.16em]",
              "transition-all duration-500 ease-[var(--ease-amity)]",
              activeSection === item.href.replace("#", "")
                ? "text-[var(--ink)]"
                : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
            )}
          >
            {activeSection === item.href.replace("#", "") && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-0 rounded-full bg-[rgba(201,154,70,0.14)] border border-[rgba(122,31,43,0.12)]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex items-center justify-center w-12 h-12 rounded-full glass-warm shadow-[0_4px_32px_rgba(122,31,43,0.08)]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <div className="flex flex-col gap-1">
          <motion.span
            className="w-4 h-[1px] bg-[var(--ink)] block"
            animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 2.5 : 0 }}
          />
          <motion.span
            className="w-4 h-[1px] bg-[var(--ink)] block"
            animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -2.5 : 0 }}
          />
        </div>
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-16 right-0 w-52 py-3 px-2 rounded-2xl glass-warm shadow-[0_8px_48px_rgba(122,31,43,0.12)]"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl text-[11px] font-semibold uppercase tracking-[0.14em]",
                  "transition-colors duration-300",
                  activeSection === item.href.replace("#", "")
                    ? "text-[var(--ink)] bg-[rgba(201,154,70,0.12)]"
                    : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
                )}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
