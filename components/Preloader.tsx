"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleProgress = (e: Event) => {
      const customEvent = e as CustomEvent<{ percent: number }>;
      setProgress(customEvent.detail.percent);
      if (customEvent.detail.percent >= 100 && !isLoaded) setIsLoaded(true);
    };

    window.addEventListener("hero-progress", handleProgress);

    const fallbackTimeout = setTimeout(() => {
      if (!isLoaded) setIsLoaded(true);
    }, 4000);

    return () => {
      window.removeEventListener("hero-progress", handleProgress);
      clearTimeout(fallbackTimeout);
    };
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && containerRef.current && textRef.current && barRef.current) {
      const tl = gsap.timeline();
      tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.6, ease: "power2.inOut" }, 0.2)
        .to(barRef.current, { scaleX: 0, transformOrigin: "right", duration: 0.6, ease: "power3.inOut" }, 0.2)
        .to(containerRef.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 0.6);
    }
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[var(--night)] flex flex-col items-center justify-center pointer-events-none"
    >
      <div ref={textRef} className="flex flex-col items-center gap-6">
        <div className="text-[var(--gold)] font-display text-2xl tracking-[0.3em] font-semibold">
          AMITY
        </div>
        <div className="text-[var(--stone)] font-editorial italic text-lg tracking-wide">
          Welcome to the hills.
        </div>
        <div className="w-48 h-[1px] bg-white/10 mt-4 relative overflow-hidden">
          <div
            ref={barRef}
            className="absolute top-0 left-0 h-full bg-[var(--gold)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-[var(--stone)] text-xs tracking-[0.2em] mt-2 font-mono">
          {progress}%
        </div>
      </div>
    </div>
  );
}
