"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import SacredGeometry from "./SacredGeometry";
import ServiceTeaser from "./ServiceTeaser";
import MagneticButton from "./MagneticButton";
import AmbientSanskrit from "./AmbientSanskrit";
import DivineEmbers from "./DivineEmbers";

// No-op handler: forces Framer Motion JS engine instead of WAAPI (Safari iOS blink fix)
const noop = () => { };

const DivineTorch = dynamic(() => import("./DivineTorch"), { ssr: false });
const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const Preloader = dynamic(() => import("./Preloader"), { ssr: false });

/* ── MOBILE DETECTION ── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

const HERO_BASE_DELAY = 0; // additional offset after reveal fires

/* ── COUNTDOWN (client-only) ── */
function useCountdown(targetMs: number) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const diff = targetMs - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);
  return { timeLeft, mounted };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="text-2xl sm:text-3xl md:text-6xl font-[var(--font-cinzel)] font-bold tabular-nums min-w-[50px] sm:min-w-[55px] md:min-w-[100px] text-center text-white px-2 sm:px-3 md:px-5 py-2 md:py-4 border border-white/10 rounded-sm"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(212,175,55,0.03)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[9px] md:text-[11px] font-[var(--font-mono)] text-[#D4AF37] tracking-[0.3em] uppercase mt-3">
        {label}
      </span>
    </div>
  );
}

/* ── MAIN ── */
export default function MonolithHero() {
  const { timeLeft: countdown, mounted } = useCountdown(new Date("2026-03-09T05:55:00+05:30").getTime());
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");
  const [revealed, setRevealed] = useState(false);
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);

  // On mobile, skip the feTurbulence SVG filter — it forces CPU rasterization on
  // Safari which causes a full-page repaint blink every time any animation ends.
  const goldFilter = isMobile
    ? "drop-shadow(0 0 60px rgba(212, 175, 55, 0.3))"
    : "url(#brushedGold) drop-shadow(0 0 60px rgba(212, 175, 55, 0.3))";

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || formState === "loading") return;

    setFormState("loading");
    try {
      // Client-side Honeypot Check (catches simple bots immediately)
      const form = e.target as HTMLFormElement;
      const honeypotInput = form.querySelector('input[name="website"]') as HTMLInputElement;
      if (honeypotInput && honeypotInput.value) {
        setFormState("success");
        setFormMessage("You're on the list!");
        setEmail("");
        return;
      }

      // Hit the standard API Route instead of a Server Action
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "coming-soon", ip_address: "" }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (result.type === "duplicate") {
          setFormState("duplicate");
          setFormMessage(result.message);
        } else {
          setFormState("success");
          setFormMessage(result.message || "You're on the list!");
          setEmail("");
        }
      } else {
        setFormState("error");
        setFormMessage(result.message);
        // Reset error after 4 seconds
        setTimeout(() => setFormState("idle"), 4000);
      }
    } catch {
      setFormState("error");
      setFormMessage("Something went wrong. Please try again.");
      setTimeout(() => setFormState("idle"), 4000);
    }
  };

  const handleReveal = useCallback(() => setRevealed(true), []);

  // Delay offsets for hero entrance (only animate after preloader reveal)
  const d = (t: number) => revealed ? HERO_BASE_DELAY + t : 999;

  return (
    <>
      <Preloader onReveal={handleReveal} />
      <SmoothScroll />
      <DivineTorch />
      <DivineEmbers revealed={revealed} />

      {/* GRAIN TEXTURE OVERLAY (entire page) */}
      <div
        className="fixed inset-0 z-[50] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ═══════════════════════════════════════════
          SECTION 1: CINEMATIC HERO — FULL VIEWPORT
      ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[100dvh] w-full overflow-hidden bg-obsidian">

        {/* OPTICAL CENTERING WRAPPER (Shifts content up on tall mobile screens) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-[6vh] md:translate-y-0">

          {/* SACRED GEOMETRY — only mount after preloader exits, freeing iOS GPU during loading */}
          {revealed && <SacredGeometry />}
          {revealed && <AmbientSanskrit />}

          {/* AMBIENT BREATHING GLOW */}
          <motion.div
            className="absolute z-[1] pointer-events-none w-[80vw] h-[80vw] md:w-[900px] md:h-[900px]"
            animate={{ opacity: [0.08, 0.15, 0.08], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            onUpdate={noop}
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -55%)",
              background: "radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 40%, transparent 65%)",
              filter: "blur(80px)",
            }}
          />

          {/* ── CINEMATIC SEQUENCE ── */}
          <motion.div
            className="relative z-10 flex flex-col items-center px-6"
            style={{ scale: logoScale, opacity: logoOpacity, y: contentY, willChange: "transform, opacity" }}
          >
            {/* STEP 1: GOLDEN LINE */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={revealed ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 1.5, delay: d(0.5), ease: [0.16, 1, 0.3, 1] }}
              onUpdate={noop}
              className="w-32 md:w-64 h-[1px] mb-10"
              style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
            />

            {/* STEP 2: THE LOGO — CSS RENDERED WITH BRUSHED GOLD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              animate={revealed ? { opacity: 1, scale: 1, filter: "none" } : {}}
              transition={{ duration: 2, delay: d(0.8), ease: "easeOut" }}

              className="flex flex-col items-center overflow-visible"
              style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", WebkitTransform: "translateZ(0)", willChange: "transform, filter, opacity" }}
            >
              {/* SVG FILTER FOR BRUSHED METAL TEXTURE */}
              <svg style={{ position: "absolute", width: 0, height: 0 }}>
                <filter id="brushedGold">
                  <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
                  <feColorMatrix type="saturate" values="0" />
                  <feComponentTransfer>
                    <feFuncR type="linear" slope="1.5" intercept="-0.3" />
                    <feFuncG type="linear" slope="1.5" intercept="-0.3" />
                    <feFuncB type="linear" slope="1.5" intercept="-0.3" />
                  </feComponentTransfer>
                  <feComposite operator="in" in2="SourceGraphic" />
                  <feBlend mode="multiply" in2="SourceGraphic" />
                </filter>
              </svg>

              {/* WORDMARK */}
              <div className="flex items-baseline gap-[clamp(0.5rem,2vw,1.25rem)] overflow-visible">
                <h1
                  className="text-[clamp(3.5rem,12vw,12rem)] leading-none overflow-visible"
                  style={{
                    background: "linear-gradient(180deg, #FFF 0%, #F9E2AF 25%, #D4AF37 55%, #8A6D3B 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: goldFilter,
                    paddingTop: "0.4em",
                    marginTop: "-0.2em",
                    fontFamily: "var(--font-gotu), serif"
                  }}
                >
                  कर्म
                </h1>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={revealed ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: d(1.5), ease: "easeOut" }}
                  onUpdate={noop}
                  className="rounded-full bg-white flex-shrink-0"
                  style={{
                    width: "clamp(0.5rem, 1.25vw, 0.75rem)",
                    height: "clamp(0.5rem, 1.25vw, 0.75rem)",
                    marginBottom: "clamp(0.6rem, 2.5vw, 2rem)",
                    boxShadow: "0 0 20px #D4AF37, 0 0 60px #D4AF37"
                  }}
                />
                <h2
                  className="text-[clamp(2.5rem,9.5vw,10rem)] tracking-[clamp(0.05em,0.2vw,0.15em)] font-[var(--font-cinzel)] font-black uppercase leading-none"
                  style={{
                    background: "linear-gradient(180deg, #FFF 0%, #F9E2AF 25%, #D4AF37 55%, #8A6D3B 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: goldFilter,
                  }}
                >
                  Phal
                </h2>
              </div>
            </motion.div>

            {/* STEP 3: TAGLINE — LETTER BY LETTER REVEAL */}
            <motion.p
              initial="hidden"
              animate={revealed ? "visible" : "hidden"}
              className="text-[clamp(0.6rem,1.6vw,1.125rem)] tracking-[clamp(0.1em,0.6vw,0.6em)] font-[var(--font-cinzel)] text-[#D4AF37] uppercase mt-[clamp(1rem,3vw,1.5rem)] flex justify-center"
              style={{ textShadow: "0 0 40px rgba(212,175,55,0.4)", width: "max-content", maxWidth: "100%" }}
            >
              {"Architecture of the Infinite".split("").map((char, i) => (
                <motion.span
                  key={`hero-tagline-char-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, delay: d(1.8 + i * 0.04), ease: "easeOut" }}
                  onUpdate={noop}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.p>

            {/* STEP 4: SERVICES */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={revealed ? { opacity: 0.9 } : {}}
              transition={{ duration: 1, delay: d(3) }}
              onUpdate={noop}
              className="text-[clamp(0.5rem,1.2vw,0.875rem)] tracking-[clamp(0.05em,0.3vw,0.3em)] font-[var(--font-cinzel)] text-[#C0C0C0] uppercase mt-4 text-center whitespace-nowrap"
            >
              Brands · Websites · Apps · AI · Decentralized Systems
            </motion.p>
          </motion.div>

        </div> {/* END OPTICAL CENTERING WRAPPER */}

        {/* SCROLL INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : {}}
          transition={{ delay: d(4), duration: 1 }}
          onUpdate={noop}
          className="absolute bottom-10 z-20 flex flex-col items-center gap-2 left-1/2 -translate-x-1/2"
        >
          <span className="text-[10px] md:text-xs font-[var(--font-mono)] text-[#D4AF37] tracking-[0.4em] uppercase" style={{ textShadow: "0 0 10px rgba(212,175,55,0.4)" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onUpdate={noop}
            className="w-[1px] h-10 bg-gradient-to-b from-[#D4AF37] to-transparent"
            style={{ boxShadow: "0 0 6px rgba(212,175,55,0.3)" }}
          />
        </motion.div>
      </section >

      {/* ═══════════════════════════════════════════
          SECTION 2: LAUNCHING SOON + COUNTDOWN
      ═══════════════════════════════════════════ */}
      <section className="relative z-10 w-full py-24 flex flex-col items-center overflow-hidden">
        {/* Subtle top border */}
        < div className="w-full h-[1px] mb-20" style={{ background: "linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.15) 50%, transparent 90%)" }
        } />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          onUpdate={noop}
          className="flex flex-col items-center gap-10 px-6"
        >
          {/* MANIFESTO */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            onUpdate={noop}
            className="text-xl sm:text-2xl md:text-4xl font-[var(--font-cinzel)] font-bold text-white text-center tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.3em]"
          >
            We don&apos;t build ordinary brands.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            onUpdate={noop}
            className="text-sm sm:text-base md:text-lg font-[var(--font-cinzel)] text-[#C0C0C0] text-center max-w-xl leading-relaxed tracking-wide"
          >
            We architect <span className="text-[#D4AF37] font-bold">extraordinary</span> ones — identities so refined, they don&apos;t compete. They <span className="text-white font-semibold">transcend</span>.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            onUpdate={noop}
            className="text-xs md:text-sm font-[var(--font-cinzel)] text-[#C0C0C0]/60 text-center max-w-md tracking-[0.1em]"
          >
            If you&apos;re serious about standing out — we&apos;re about to change the game.
          </motion.p>

          {/* GOLD DIVIDER */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 1 }}
            onUpdate={noop}
            className="w-24 md:w-40 h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
          />

          {/* LAUNCHING SOON + COUNTDOWN */}
          <h3
            className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-[var(--font-cinzel)] font-bold tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.5em] uppercase text-[#D4AF37] text-center"
            style={{ textShadow: "0 0 60px rgba(212,175,55,0.2)" }}
          >
            Launching Soon
          </h3>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-8" suppressHydrationWarning>
            {mounted && (
              <>
                <CountdownUnit value={countdown.days} label="Days" />
                <span className="text-2xl md:text-4xl text-[#D4AF37]/30 font-thin select-none">:</span>
                <CountdownUnit value={countdown.hours} label="Hours" />
                <span className="text-2xl md:text-4xl text-[#D4AF37]/30 font-thin select-none">:</span>
                <CountdownUnit value={countdown.minutes} label="Mins" />
                <span className="text-2xl md:text-4xl text-[#D4AF37]/30 font-thin select-none">:</span>
                <CountdownUnit value={countdown.seconds} label="Secs" />
              </>
            )}
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            onUpdate={noop}
            className="w-24 md:w-40 h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
          />

          <p className="text-sm md:text-base font-[var(--font-cinzel)] text-[#E0E0E0] tracking-[0.1em] md:tracking-[0.15em] text-center max-w-lg">
            Be first in line when we open the doors.
          </p>

          {/* EMAIL FORM */}
          {
            formState === "idle" || formState === "loading" || formState === "error" ? (
              <form onSubmit={handleSubmit} className="glass-morphism p-1.5 md:p-2 rounded-full flex max-w-md w-full relative">
                {/* HONEYPOT — hidden from humans, catches bots */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL"
                  required
                  autoComplete="new-password"
                  disabled={formState === "loading"}
                  className="bg-transparent border-none outline-none px-4 md:px-6 py-3.5 text-[11px] md:text-xs font-[var(--font-mono)] w-full text-[#E0E0E0] placeholder:text-[#C0C0C0]/40 tracking-widest disabled:opacity-50"
                />
                <MagneticButton
                  type="submit"
                  className="bg-[#D4AF37] text-[#010101] font-[var(--font-cinzel)] font-bold px-6 md:px-10 py-3.5 rounded-full text-[10px] md:text-xs tracking-[0.2em] hover:bg-white transition-colors duration-300 uppercase whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {formState === "loading" ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      onUpdate={noop}
                      className="inline-block w-4 h-4 border-2 border-[#010101] border-t-transparent rounded-full"
                    />
                  ) : "Notify Me"}
                </MagneticButton>
                {/* ERROR MESSAGE */}
                {formState === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onUpdate={noop}
                    className="absolute -bottom-8 left-0 right-0 text-center text-[10px] font-[var(--font-mono)] text-red-400 tracking-wider"
                  >
                    {formMessage}
                  </motion.p>
                )}
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onUpdate={noop}
                className="glass-morphism px-8 py-4 rounded-full flex items-center gap-3"
              >
                {/* GOLD CHECKMARK */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                  <motion.path
                    d="M5 13l4 4L19 7"
                    stroke="#D4AF37"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    onUpdate={noop}
                  />
                </svg>
                <p className="text-sm font-[var(--font-cinzel)] text-[#D4AF37] tracking-[0.15em]">
                  {formMessage || "You\u0027re on the list. We\u0027ll be in touch."}
                </p>
              </motion.div>
            )
          }
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3: SERVICE TEASER
      ═══════════════════════════════════════════ */}
      <ServiceTeaser />

      {/* ═══════════════════════════════════════════
          SECTION 4: FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="relative z-10 w-full py-12 flex flex-col items-center gap-6 px-6">
        <div className="w-full h-[1px] mb-6" style={{ background: "linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.15) 50%, transparent 90%)" }} />

        {/* SOCIAL */}
        <div className="flex items-center gap-8">
          <a href="https://www.linkedin.com/company/houseofkarmaphal" target="_blank" rel="noopener noreferrer"
            className="text-white/30 hover:text-[#C0C0C0] transition-colors duration-300 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a href="https://www.instagram.com/houseofkarmaphal/" target="_blank" rel="noopener noreferrer"
            className="text-white/30 hover:text-[#C0C0C0] transition-colors duration-300 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a href="mailto:abhi@karmaphal.in"
            className="text-white/30 hover:text-[#C0C0C0] transition-colors duration-300 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>

        <p className="text-[10px] font-[var(--font-mono)] text-[#C0C0C0]/30 tracking-[0.3em] text-center">
          © 2026 KARMAPHAL · ALL RIGHTS RESERVED
        </p>
      </footer>
    </>
  );
}