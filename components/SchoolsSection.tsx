"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";

const SCHOOLS = [
  {
    name: "Engineering & Technology",
    tagline: "Build what matters.",
    programs: ["B.Tech (CSE, ECE, ME, Civil)", "M.Tech", "Ph.D"],
    color: "#C99A46",
    image: "/images/campus/academic-block-day.jpg",
  },
  {
    name: "Business & Management",
    tagline: "Lead with numbers, not just instinct.",
    programs: ["BBA", "MBA", "Executive MBA", "Ph.D"],
    color: "#7A1F2B",
    image: "/images/campus/lake-fountain-sunrise.jpg",
  },
  {
    name: "Law & Governance",
    tagline: "Argue better. Govern wiser.",
    programs: ["BA LLB (Hons)", "BBA LLB (Hons)", "LLM", "Ph.D"],
    color: "#A9C4D8",
    image: "/images/campus/amphitheatre-night.jpg",
  },
  {
    name: "Liberal Arts & Design",
    tagline: "Creativity meets critical thinking.",
    programs: ["B.Des", "BA (Hons)", "MA", "MFA"],
    color: "#E8A33D",
    image: "/images/campus/academic-block-day.jpg",
  },
];

export default function SchoolsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".school-card", track);
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      cards.forEach((card) => {
        const img = card.querySelector(".school-image") as HTMLElement;
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.2 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: gsap.getById?.("schools-scroll") || undefined,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="schools"
      className="relative overflow-hidden bg-[var(--background)]"
    >
      <div className="absolute top-12 left-6 md:left-16 z-10">
        <SectionLabel text="Our Schools" />
      </div>

      <div
        ref={trackRef}
        className="flex items-stretch gap-6 pl-6 md:pl-16 pr-[50vw] h-screen"
        style={{ width: "fit-content" }}
      >
        {/* Lead card */}
        <div className="flex-shrink-0 w-[40vw] min-w-[320px] flex flex-col justify-center pr-8">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              fontWeight: 700,
            }}
          >
            Five schools.
            <br />
            <span className="font-editorial italic text-[var(--maroon)]">
              One campus.
            </span>
          </h2>
          <p className="mt-6 text-[var(--muted-ink)] max-w-md text-section-body leading-relaxed">
            Each faculty is housed under its own institute, with dedicated labs,
            studios, and research centres — but they share the same 152-acre
            campus, the same library, and the same ambition.
          </p>
        </div>

        {/* School cards */}
        {SCHOOLS.map((school, i) => (
          <div
            key={i}
            className="school-card flex-shrink-0 w-[65vw] md:w-[45vw] lg:w-[35vw] relative group rounded-2xl overflow-hidden cursor-pointer"
            style={{ minHeight: "70vh" }}
          >
            {/* Image */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="school-image absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[var(--ease-amity)] group-hover:scale-105"
                style={{ backgroundImage: `url(${school.image})` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 30%, rgba(16,13,11,0.85) 100%)`,
                }}
              />
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: school.color }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
              <div
                className="text-xs uppercase tracking-[0.2em] font-semibold mb-3"
                style={{ color: school.color }}
              >
                School {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="font-display text-[var(--surface)] mb-2"
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {school.name}
              </h3>
              <p className="font-editorial italic text-[var(--stone)] text-lg mb-4">
                {school.tagline}
              </p>
              <div className="flex flex-wrap gap-2">
                {school.programs.map((prog, j) => (
                  <span
                    key={j}
                    className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.12em] font-semibold border border-white/20 text-white/70"
                  >
                    {prog}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
