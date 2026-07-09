"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { initLenis, destroyLenis } from "@/lib/lenis";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import FloatingNav from "@/components/FloatingNav";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import SchoolsSection from "@/components/SchoolsSection";
import LegacySection from "@/components/LegacySection";
import CampusLifeSection from "@/components/CampusLifeSection";
import AdmissionsSection from "@/components/AdmissionsSection";
import PlacementsSection from "@/components/PlacementsSection";
import ApplyCTASection from "@/components/ApplyCTASection";
import AtmosphereLayer from "@/components/AtmosphereLayer";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const lenis = initLenis();
    let lenisRaf: ((time: number) => void) | null = null;

    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      lenisRaf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(lenisRaf);
      gsap.ticker.lagSmoothing(0);
    }

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad, { once: true });
    const refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener("load", onLoad);
      if (lenisRaf) gsap.ticker.remove(lenisRaf);
      destroyLenis();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Preloader />
      <FloatingNav />
      <AtmosphereLayer />
      <main ref={mainRef} id="main-content" role="main">
        <div id="hero-root" style={{ height: "600vh", position: "relative" }}>
          <HeroSection />
        </div>
        <MissionSection />
        <SchoolsSection />
        <LegacySection />
        <CampusLifeSection />
        <AdmissionsSection />
        <PlacementsSection />
        <ApplyCTASection />
      </main>
    </>
  );
}
