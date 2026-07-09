"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

/* ── Frame-swap config ── */
const TOTAL_FRAMES = 500;
const FRAME_STEP = 10; // Use every 10th frame from the 5,000 source frames
const FRAME_PATH = "/hero-frames/";

function frameUrl(index: number): string {
  const sourceIndex = index * FRAME_STEP;
  return `${FRAME_PATH}frame_${String(sourceIndex).padStart(6, "0")}.jpg`;
}

const COPY_SEQUENCE = [
  { text: "AMITY UNIVERSITY", type: "title" as const, start: 0, end: 15 },
  { text: "152 acres in the Aravali hills.", type: "line" as const, start: 12, end: 26 },
  { text: "One campus. Every ambition.", type: "accent" as const, start: 23, end: 36 },
  { text: "Research. Recreation. Results.", type: "line" as const, start: 33, end: 46 },
  { text: "Where the next decade of leaders is being built.", type: "line" as const, start: 43, end: 58 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalTextRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);

  /* ── Preload frames in batches ── */
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    const batchSize = 20;
    let batchIndex = 0;

    function loadBatch() {
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, TOTAL_FRAMES);
      if (start >= TOTAL_FRAMES) return;

      for (let i = start; i < end; i++) {
        const img = new Image();
        img.src = frameUrl(i);
        img.onload = img.onerror = () => {
          loaded++;
          const percent = Math.min(100, Math.round((loaded / TOTAL_FRAMES) * 100));
          setLoadProgress(percent);
          window.dispatchEvent(
            new CustomEvent("hero-progress", { detail: { percent } })
          );

          if (loaded === end) {
            batchIndex++;
            requestAnimationFrame(loadBatch);
          }
        };
        images[i] = img;
      }
    }

    loadBatch();
    imagesRef.current = images;
  }, []);

  /* ── Draw frame to canvas ── */
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img || !img.complete) return;

    if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  /* ── Scroll-scrub canvas frames ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const wrapper = document.getElementById("hero-root");
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !section || !canvas) return;

    // Initial draw
    const initDraw = () => {
      if (imagesRef.current[0]?.complete) drawFrame(0);
      else setTimeout(initDraw, 100);
    };
    initDraw();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          const frame = Math.min(
            TOTAL_FRAMES - 1,
            Math.floor(self.progress * (TOTAL_FRAMES - 1))
          );
          if (frame !== currentFrameRef.current) {
            currentFrameRef.current = frame;
            drawFrame(frame);
          }
        },
      });

      // Bloom glow
      if (bloomRef.current) {
        gsap.fromTo(
          bloomRef.current,
          { opacity: 0.05 },
          {
            opacity: 0.4,
            ease: "none",
            scrollTrigger: { trigger: wrapper, start: "top top", end: "55% bottom", scrub: 1 },
          }
        );
      }

      // Final editorial text
      if (finalTextRef.current) {
        gsap.fromTo(
          finalTextRef.current,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: wrapper, start: "75% top", end: "95% top", scrub: true },
          }
        );
      }

      // Copy sequence
      copyRefs.current.forEach((el, i) => {
        if (!el) return;
        const { start, end } = COPY_SEQUENCE[i];
        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrapper, start: `${start}% top`, end: `${end}% top`, scrub: 1 },
        });
        tl.fromTo(
          el,
          { opacity: 0, z: -1200, scale: 0.7, rotationX: i % 2 === 0 ? 8 : -8 },
          { opacity: 1, z: 0, scale: 1, rotationX: 0, duration: 0.4, ease: "power2.out" }
        );
        tl.to(el, { opacity: 0, z: 1200, scale: 2, duration: 0.6, ease: "power2.in" });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  /* ── Page load entrance ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline({ delay: 1.8 });
    if (overlayRef.current)
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0);
    if (copyRefs.current[0]) {
      tl.fromTo(
        copyRefs.current[0],
        { opacity: 0, y: 60, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" },
        0.2
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="sticky top-0 w-full h-screen overflow-hidden"
      style={{ zIndex: 10 }}
      aria-label="Hero — Amity University campus"
    >
      {/* Scroll-scrubbed canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `
            linear-gradient(180deg, rgba(16,13,11,0.3) 0%, rgba(16,13,11,0.0) 30%, rgba(16,13,11,0.0) 60%, rgba(16,13,11,0.45) 100%),
            linear-gradient(90deg, rgba(16,13,11,0.18) 0%, transparent 25%, transparent 75%, rgba(16,13,11,0.18) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Bloom glow */}
      <div
        ref={bloomRef}
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 25%, rgba(201,154,70,0.16) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* 3D text sequence */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[5]"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full max-w-[90vw] text-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {COPY_SEQUENCE.map((item, i) => (
            <div
              key={i}
              ref={(el) => {
                copyRefs.current[i] = el;
              }}
              className="absolute inset-0 flex items-center justify-center opacity-0 will-change-transform"
              style={{ backfaceVisibility: "hidden" }}
            >
              {item.type === "title" ? (
                <h1
                  className="font-display select-none"
                  style={{
                    fontSize: "clamp(3rem, 11vw, 10.5rem)",
                    lineHeight: 0.88,
                    letterSpacing: "-0.04em",
                    fontWeight: 800,
                    color: "#FFFCF6",
                    textShadow:
                      "0 4px 60px rgba(0,0,0,0.5), 0 0 120px rgba(201,154,70,0.14)",
                  }}
                >
                  {item.text}
                </h1>
              ) : item.type === "accent" ? (
                <p
                  className="font-editorial select-none"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                    lineHeight: 1,
                    fontStyle: "italic",
                    color: "var(--gold)",
                    textShadow:
                      "0 4px 40px rgba(0,0,0,0.8), 0 0 80px rgba(201,154,70,0.4)",
                  }}
                >
                  {item.text}
                </p>
              ) : (
                <p
                  className="font-display select-none max-w-4xl mx-auto uppercase"
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.4rem)",
                    lineHeight: 1.5,
                    letterSpacing: "0.16em",
                    fontWeight: 600,
                    color: "#FFFCF6",
                    textShadow: "0 4px 30px rgba(0,0,0,0.9)",
                  }}
                >
                  {item.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final editorial line */}
      <div
        ref={finalTextRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-[6] opacity-0 pointer-events-none"
        style={{ perspective: "1400px" }}
      >
        <div
          className="text-center px-6 md:px-14"
          style={{ transformStyle: "preserve-3d" }}
        >
          <h2
            className="font-display select-none uppercase"
            style={{
              fontSize: "clamp(2.75rem, 9vw, 9.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#221b13",
            }}
          >
            Ambition
          </h2>
          <p
            className="font-editorial select-none"
            style={{
              fontSize: "clamp(2rem, 7.5vw, 8rem)",
              fontStyle: "italic",
              letterSpacing: "-0.01em",
              color: "#8f6a3a",
              marginTop: "-0.2em",
              marginBottom: "2rem",
            }}
          >
            finds its address.
          </p>
          <p
            className="font-display select-none mx-auto opacity-70"
            style={{
              fontSize: "clamp(0.6rem, 0.9vw, 0.8rem)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#221b13",
              maxWidth: "42ch",
              fontWeight: 600,
            }}
          >
            Amity University, Rajasthan — 152 acres, Delhi-Jaipur highway.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[6] flex flex-col items-center gap-3 opacity-60">
        <span
          className="uppercase font-semibold"
          style={{
            fontSize: "0.5625rem",
            letterSpacing: "0.3em",
            color: "#FFFCF6",
          }}
        >
          Scroll to explore
        </span>
        <div
          className="w-[1px] h-10 relative overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute top-0 left-0 w-full h-full bg-white/40"
            style={{
              animation: "heroScrollPulse 2.4s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes heroScrollPulse {
          0%,
          100% {
            transform: scaleY(0.2);
            opacity: 0.2;
            transform-origin: top;
          }
          50% {
            transform: scaleY(1);
            opacity: 0.6;
            transform-origin: top;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes heroScrollPulse {
            0%,
            100% {
              opacity: 0.4;
            }
          }
        }
      `}</style>
    </section>
  );
}
