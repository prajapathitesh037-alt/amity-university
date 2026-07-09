"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";

const MISSION_WORDS = [
  "We", "educate", "the", "ones", "who", "will", "lead.",
  "Not", "just", "degrees.", "Direction.",
  "Knowledge,", "discipline,", "and", "recreation", "—", "together.",
  "Every", "school", "here", "is", "built", "around", "one", "outcome:",
  "A", "graduate", "the", "world", "is", "ready", "for.",
];

const HIGHLIGHT_WORDS = ["lead.", "Direction.", "together.", "outcome:", "for."];

export default function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".mission-word", wrapper);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: wrapper,
        pinSpacing: false,
      });

      words.forEach((word, i) => {
        gsap.fromTo(
          word,
          { opacity: 0.12 },
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: `${(i / words.length) * 80}% top`,
              end: `${((i + 1) / words.length) * 80 + 5}% top`,
              scrub: 1,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="mission"
      className="relative bg-[var(--background)]"
      style={{ height: "300vh" }}
    >
      <div
        ref={wrapperRef}
        className="h-screen flex flex-col items-center justify-center px-6 md:px-16"
      >
        <SectionLabel text="Our Mission" className="mb-12" />
        <div
          className="max-w-5xl mx-auto text-center leading-[1.3] md:leading-[1.2]"
          style={{
            fontSize: "clamp(1.75rem, 4.5vw, 4rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {MISSION_WORDS.map((word, i) => (
            <span
              key={i}
              className={`mission-word inline-block mr-[0.35em] ${
                HIGHLIGHT_WORDS.includes(word)
                  ? "font-editorial italic text-[var(--maroon)]"
                  : "font-display text-[var(--ink)]"
              }`}
              style={{ opacity: 0.12 }}
            >
              {word}
            </span>
          ))}
        </div>
        <div className="mt-16 w-16 h-[1px] bg-[var(--gold)] opacity-40" />
      </div>
    </section>
  );
}
