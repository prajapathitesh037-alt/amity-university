"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";
import { ChevronDown } from "lucide-react";

const ADMISSION_CATEGORIES = [
  {
    title: "Undergraduate",
    subtitle: "Build your foundation.",
    programs: [
      { name: "B.Tech (CSE, ECE, ME, Civil, AI/ML)", duration: "4 Years", eligibility: "10+2 with PCM, JEE/SAT" },
      { name: "BBA", duration: "3 Years", eligibility: "10+2 any stream" },
      { name: "BA LLB (Hons)", duration: "5 Years", eligibility: "10+2, CLAT/LSAT" },
      { name: "B.Des", duration: "4 Years", eligibility: "10+2, Portfolio" },
      { name: "B.Com (Hons)", duration: "3 Years", eligibility: "10+2 Commerce" },
      { name: "BA (Hons) Liberal Arts", duration: "3 Years", eligibility: "10+2 any stream" },
      { name: "B.Sc (Hons) Biotechnology", duration: "3 Years", eligibility: "10+2 with PCB" },
    ],
  },
  {
    title: "Postgraduate",
    subtitle: "Sharpen your edge.",
    programs: [
      { name: "MBA (General / Finance / Marketing / HR)", duration: "2 Years", eligibility: "Graduate, CAT/MAT/GMAT" },
      { name: "M.Tech (CSE, ECE, Structural)", duration: "2 Years", eligibility: "B.Tech, GATE preferred" },
      { name: "LLM (Corporate / Constitutional)", duration: "1 Year", eligibility: "LLB" },
      { name: "MA (English / Psychology / Economics)", duration: "2 Years", eligibility: "Graduate" },
      { name: "M.Des", duration: "2 Years", eligibility: "Graduate, Portfolio" },
      { name: "M.Sc (Applied Mathematics / Physics)", duration: "2 Years", eligibility: "B.Sc related" },
    ],
  },
  {
    title: "Doctoral",
    subtitle: "Push the frontier.",
    programs: [
      { name: "Ph.D (Engineering & Technology)", duration: "3-5 Years", eligibility: "M.Tech/ME, NET/GATE" },
      { name: "Ph.D (Management)", duration: "3-5 Years", eligibility: "MBA/M.Com, NET" },
      { name: "Ph.D (Law)", duration: "3-5 Years", eligibility: "LLM" },
      { name: "Ph.D (Sciences)", duration: "3-5 Years", eligibility: "M.Sc, NET/GATE" },
      { name: "Ph.D (Humanities & Social Sciences)", duration: "3-5 Years", eligibility: "MA, NET" },
    ],
  },
];

export default function AdmissionsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector(".admissions-header"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const toggleCategory = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section
      ref={sectionRef}
      id="admissions"
      className="relative bg-[var(--background)] py-24 md:py-40 px-6 md:px-16"
    >
      <div className="admissions-header mb-16">
        <SectionLabel text="Admissions" className="mb-8" />
        <h2
          className="font-display max-w-3xl"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 700,
          }}
        >
          Find your{" "}
          <span className="font-editorial italic text-[var(--maroon)]">
            program.
          </span>
        </h2>
        <p className="mt-4 text-[var(--muted-ink)] max-w-xl text-section-body">
          150+ programs across five schools. Here&apos;s a snapshot — explore
          what fits your trajectory.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        {ADMISSION_CATEGORIES.map((category, i) => (
          <div
            key={i}
            className="border border-[var(--stone)]/30 rounded-2xl overflow-hidden transition-colors duration-300 hover:border-[var(--gold)]/40"
          >
            {/* Header */}
            <button
              onClick={() => toggleCategory(i)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--gold)]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-display"
                    style={{
                      fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {category.title}
                  </h3>
                </div>
                <p className="text-[var(--muted-ink)] font-editorial italic text-sm md:text-base">
                  {category.subtitle}
                </p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[var(--muted-ink)] transition-transform duration-500 ease-[var(--ease-out-amity)] ${
                  activeIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Content */}
            <div
              ref={(el) => { contentRefs.current[i] = el; }}
              className="overflow-hidden transition-all duration-700 ease-[var(--ease-out-amity)]"
              style={{
                maxHeight: activeIndex === i ? "600px" : "0px",
                opacity: activeIndex === i ? 1 : 0,
              }}
            >
              <div className="px-6 md:px-8 pb-8">
                <div className="border-t border-[var(--stone)]/20 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.programs.map((program, j) => (
                      <div
                        key={j}
                        className="p-4 rounded-xl bg-[var(--background)] border border-[var(--stone)]/15 hover:border-[var(--gold)]/30 transition-colors duration-300 group/card"
                      >
                        <h4 className="font-display font-semibold text-sm mb-2 group-hover/card:text-[var(--maroon)] transition-colors">
                          {program.name}
                        </h4>
                        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                          <span>{program.duration}</span>
                          <span className="w-[3px] h-[3px] rounded-full bg-[var(--stone)]" />
                          <span>{program.eligibility}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
