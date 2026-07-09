"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";
import CounterStat from "./ui/CounterStat";

const PLACEMENT_STATS = [
  { end: 95, suffix: "%", label: "Placement Rate" },
  { end: 500, suffix: "+", label: "Recruiting Companies" },
  { end: 42, suffix: "LPA", prefix: "₹", label: "Highest Package" },
  { end: 8, suffix: "LPA", prefix: "₹", label: "Average Package" },
];

export default function PlacementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const currentRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const spotlight = spotlightRef.current;
    if (!section || !spotlight) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };

    const tick = () => {
      currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * 0.08;
      currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * 0.08;

      const x = currentRef.current.x * 100;
      const y = currentRef.current.y * 100;
      spotlight.style.background = `radial-gradient(circle 280px at ${x}% ${y}%, rgba(232,163,61,0.25) 0%, transparent 100%)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    section.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    const ctx = gsap.context(() => {
      const content = section.querySelector(".placements-content");
      if (content) {
        gsap.fromTo(
          content,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, section);

    return () => {
      section.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="placements"
      className="relative min-h-screen bg-[var(--night)] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/images/campus/amphitheatre-night.jpg)" }}
      />

      {/* Spotlight cursor effect */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-[1]"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[var(--night)]/60 z-[1]" />

      {/* Content */}
      <div className="placements-content relative z-[2] text-center px-6 md:px-16 py-24">
        <SectionLabel text="Placements" light className="justify-center mb-10" />

        <h2
          className="font-display text-[var(--surface)] mb-4"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            fontWeight: 700,
          }}
        >
          Where ambition
          <br />
          <span className="font-editorial italic text-[var(--amber-night)]">
            meets opportunity.
          </span>
        </h2>

        <p className="text-[var(--stone)] max-w-2xl mx-auto mb-16 text-section-body leading-relaxed">
          Our dedicated Training & Placement Cell connects students with
          Fortune 500 companies, top consultancies, and leading startups.
          Over 500 companies recruit from our campus every year.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 max-w-4xl mx-auto mb-16">
          {PLACEMENT_STATS.map((stat, i) => (
            <CounterStat
              key={i}
              end={stat.end}
              suffix={stat.suffix}
              prefix={stat.prefix || ""}
              label={stat.label}
              light
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {[
            "Microsoft",
            "Google",
            "Amazon",
            "Deloitte",
            "EY",
            "Infosys",
            "TCS",
            "Wipro",
            "Goldman Sachs",
            "JP Morgan",
            "Accenture",
            "McKinsey",
          ].map((company, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.14em] font-semibold border border-white/10 text-white/50 hover:border-[var(--amber-night)]/40 hover:text-[var(--amber-night)] transition-colors duration-300"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
