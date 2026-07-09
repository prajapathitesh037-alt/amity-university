"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";
import CounterStat from "./ui/CounterStat";

const STATS = [
  { end: 152, suffix: "", label: "Acres of Campus" },
  { end: 12, suffix: "+", label: "Research Centres" },
  { end: 150, suffix: "+", label: "Programs Offered" },
  { end: 25, suffix: "+", label: "Years of Legacy" },
];

const LEGACY_LINES = [
  { text: "Established by the Ritnand Balved Education Foundation.", type: "normal" },
  { text: "Recognized by UGC. Accredited NAAC A+.", type: "highlight" },
  { text: "Set in the Aravali foothills on the Delhi-Jaipur expressway.", type: "normal" },
  { text: "A campus that believes in building complete graduates.", type: "highlight" },
];

export default function LegacySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: pin,
        pinSpacing: false,
      });

      const lines = gsap.utils.toArray<HTMLElement>(".legacy-line", pin);
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: `${15 + i * 18}% top`,
              end: `${25 + i * 18}% top`,
              scrub: 1,
            },
          }
        );
      });

      const divider = pin.querySelector(".legacy-divider");
      if (divider) {
        gsap.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "60% top",
              end: "70% top",
              scrub: 1,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="legacy"
      className="relative bg-[var(--night)]"
      style={{ height: "350vh" }}
    >
      <div
        ref={pinRef}
        className="h-screen flex flex-col items-center justify-center px-6 md:px-16"
      >
        <SectionLabel text="Legacy & Recognition" light className="mb-10" />

        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          {LEGACY_LINES.map((line, i) => (
            <p
              key={i}
              className={`legacy-line opacity-0 ${
                line.type === "highlight"
                  ? "font-editorial italic text-[var(--gold)]"
                  : "font-display text-[var(--surface)]"
              }`}
              style={{
                fontSize:
                  line.type === "highlight"
                    ? "clamp(1.5rem, 3vw, 2.5rem)"
                    : "clamp(1rem, 1.8vw, 1.35rem)",
                lineHeight: 1.5,
                letterSpacing: line.type === "highlight" ? "-0.01em" : "0.01em",
                fontWeight: line.type === "highlight" ? 500 : 400,
              }}
            >
              {line.text}
            </p>
          ))}
        </div>

        <div
          className="legacy-divider w-24 h-[1px] bg-[var(--gold)] mb-12 origin-left"
          style={{ transform: "scaleX(0)" }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-4xl">
          {STATS.map((stat, i) => (
            <CounterStat
              key={i}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
              light
            />
          ))}
        </div>
      </div>
    </section>
  );
}
