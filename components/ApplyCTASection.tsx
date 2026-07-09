"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import SectionLabel from "./ui/SectionLabel";
import MagneticButton from "./ui/MagneticButton";
import { X } from "lucide-react";

export default function ApplyCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rafRef = useRef<number>(0);

  /* ── Particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = [];

    const count = Math.min(60, Math.floor((width * height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 154, 70, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 154, 70, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector(".cta-content"),
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    // Form submission logic would go here
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="apply"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)]"
      >
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="cta-content relative z-10 text-center px-6 md:px-16 py-24">
          <SectionLabel text="Take the Next Step" className="justify-center mb-10" />

          <h2
            className="font-display mb-6"
            style={{
              fontSize: "clamp(2.75rem, 7vw, 7rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              fontWeight: 700,
            }}
          >
            Your chapter
            <br />
            <span className="font-editorial italic text-[var(--maroon)]">
              starts here.
            </span>
          </h2>

          <p className="text-[var(--muted-ink)] max-w-xl mx-auto mb-10 text-section-body leading-relaxed">
            Admissions for 2025-26 are now open. Apply online, schedule a campus
            visit, or speak with our admissions team directly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              variant="primary"
              size="lg"
              onClick={() => setIsModalOpen(true)}
            >
              Apply Now
            </MagneticButton>
            <MagneticButton variant="secondary" size="lg">
              Schedule a Visit
            </MagneticButton>
          </div>

          <div className="mt-16 text-[var(--muted-ink)] text-xs tracking-[0.1em] space-y-1">
            <p>Toll-free: 1800-102-1345</p>
            <p>admissions@amity.edu</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--night)] text-[var(--stone)] py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="font-display text-[var(--gold)] text-xl tracking-[0.2em] font-bold mb-4">
              AMITY
            </div>
            <p className="text-sm leading-relaxed opacity-60">
              Amity University, Rajasthan
              <br />
              SP-1, Kant Kalwar, NH-11C
              <br />
              Jaipur, Rajasthan 303002
            </p>
          </div>
          <div>
            <h4 className="text-[var(--surface)] font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              Academics
            </h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li>Engineering</li>
              <li>Business</li>
              <li>Law</li>
              <li>Liberal Arts</li>
              <li>Design</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--surface)] font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              Campus
            </h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li>Virtual Tour</li>
              <li>Hostels</li>
              <li>Sports</li>
              <li>Library</li>
              <li>Research</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--surface)] font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              Connect
            </h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li>Admissions</li>
              <li>Placements</li>
              <li>Alumni</li>
              <li>Contact</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-40">
            © {new Date().getFullYear()} Amity University, Rajasthan. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs opacity-40">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Sitemap</span>
          </div>
        </div>
      </footer>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[var(--surface)] rounded-2xl p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.3)] z-10"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--stone)]/20 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-[var(--muted-ink)]" />
              </button>

              <h3
                className="font-display mb-1"
                style={{ fontSize: "1.5rem", fontWeight: 700 }}
              >
                Admission Enquiry
              </h3>
              <p className="text-[var(--muted-ink)] text-sm mb-6">
                Fill in your details and our team will reach out within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--stone)]/20 text-sm font-display focus:border-[var(--gold)] focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--stone)]/20 text-sm font-display focus:border-[var(--gold)] focus:outline-none transition-colors"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--stone)]/20 text-sm font-display focus:border-[var(--gold)] focus:outline-none transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--stone)]/20 text-sm font-display focus:border-[var(--gold)] focus:outline-none transition-colors"
                />
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--stone)]/20 text-sm font-display focus:border-[var(--gold)] focus:outline-none transition-colors text-[var(--muted-ink)]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Program
                  </option>
                  <option>B.Tech</option>
                  <option>BBA</option>
                  <option>BA LLB</option>
                  <option>MBA</option>
                  <option>M.Tech</option>
                  <option>B.Des / M.Des</option>
                  <option>Ph.D</option>
                  <option>Other</option>
                </select>
                <textarea
                  placeholder="Any specific questions? (optional)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--stone)]/20 text-sm font-display focus:border-[var(--gold)] focus:outline-none transition-colors resize-none"
                />
                <MagneticButton variant="primary" size="md" onClick={() => {}}>
                  Submit Enquiry
                </MagneticButton>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
