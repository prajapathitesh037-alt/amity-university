"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";

const AMENITIES = [
  {
    title: "Central Library",
    description:
      "Four floors. Over 1,00,000 volumes. Digital access to global journals, quiet study zones, and a rare-books archive.",
    image: "/images/campus/academic-block-day.jpg",
  },
  {
    title: "Sports Complex",
    description:
      "Olympic-size pool, FIFA-standard turf, indoor courts, gymnasium, and a cricket ground that hosts inter-university tournaments.",
    image: "/images/campus/lake-fountain-sunrise.jpg",
  },
  {
    title: "Residential Hostels",
    description:
      "Separate blocks for men and women, each with mess halls, recreation rooms, laundry, and 24/7 security.",
    image: "/images/campus/academic-block-day.jpg",
  },
  {
    title: "Open Amphitheatre",
    description:
      "A 2,000-seat open-air venue for cultural fests, convocations, and guest lectures under the Rajasthan sky.",
    image: "/images/campus/amphitheatre-night.jpg",
  },
];

export default function CampusLifeSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".campus-item", section);
      items.forEach((item) => {
        const img = item.querySelector(".campus-image") as HTMLElement;
        const content = item.querySelector(".campus-content") as HTMLElement;

        if (img) {
          gsap.fromTo(
            img,
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 1,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: item,
                start: "top 75%",
                end: "top 25%",
                scrub: 1,
              },
            }
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 70%",
                toggleActions: "play none none reverse",
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
      id="campus-life"
      className="relative bg-[var(--surface)] py-24 md:py-40"
    >
      <div className="px-6 md:px-16 mb-16">
        <SectionLabel text="Campus Life" className="mb-8" />
        <h2
          className="font-display max-w-3xl"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 700,
          }}
        >
          More than a campus.
          <br />
          <span className="font-editorial italic text-[var(--gold)]">
            A complete ecosystem.
          </span>
        </h2>
      </div>

      <div className="space-y-20 md:space-y-32">
        {AMENITIES.map((amenity, i) => (
          <div
            key={i}
            className={`campus-item grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center px-6 md:px-16 ${
              i % 2 === 1 ? "md:direction-rtl" : ""
            }`}
            style={{ direction: i % 2 === 1 ? "rtl" : "ltr" }}
          >
            <div
              className="campus-image relative aspect-[4/3] rounded-xl overflow-hidden"
              style={{ direction: "ltr" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${amenity.image})` }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
              <div
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold"
                style={{
                  background: "rgba(251,246,238,0.85)",
                  backdropFilter: "blur(8px)",
                  color: "var(--ink)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>

            <div className="campus-content" style={{ direction: "ltr" }}>
              <h3
                className="font-display mb-4"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {amenity.title}
              </h3>
              <p
                className="text-[var(--muted-ink)] leading-relaxed max-w-lg"
                style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}
              >
                {amenity.description}
              </p>
              <div className="mt-6 w-12 h-[1px] bg-[var(--gold)] opacity-50" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
