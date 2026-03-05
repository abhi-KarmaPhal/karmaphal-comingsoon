"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";

// No-op handler: when passed as onUpdate, forces Framer Motion to use the JS
// animation engine instead of WAAPI. Safari iOS has a compositor-layer-demotion
// bug that causes a visible flash when WAAPI animations complete.
const noop = () => { };

/* ── LOW-END DEVICE DETECTION ── */
function useIsLowEnd() {
  const [isLowEnd, setIsLowEnd] = useState(false);
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    const mem = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;
    setIsLowEnd(cores <= 4 || mem <= 2);
  }, []);
  return isLowEnd;
}

/* ── ANIMATED SVG PRIMITIVES ── */
function ACircle({ cx, cy, r, delay, duration, sw = 0.8 }: { cx: number; cy: number; r: number; delay: number; duration: number; sw?: number }) {
  return (
    <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke="#D4AF37" strokeWidth={sw}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration, delay, ease: "easeInOut" }}
      onUpdate={noop}
    />
  );
}

function ALine({ x1, y1, x2, y2, delay, duration }: { x1: number; y1: number; x2: number; y2: number; delay: number; duration: number }) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4AF37" strokeWidth="0.5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration, delay, ease: "easeInOut" }}
      onUpdate={noop}
    />
  );
}

function APoly({ points, delay, duration }: { points: string; delay: number; duration: number }) {
  return (
    <motion.polygon points={points} fill="none" stroke="#D4AF37" strokeWidth="0.6"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration, delay, ease: "easeInOut" }}
      onUpdate={noop}
    />
  );
}

function AEllipse({ cx, cy, rx, ry, rot, delay, duration }: { cx: number; cy: number; rx: number; ry: number; rot: number; delay: number; duration: number }) {
  return (
    <motion.ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#D4AF37" strokeWidth="0.5"
      transform={`rotate(${rot} 500 500)`}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration, delay, ease: "easeInOut" }}
      onUpdate={noop}
    />
  );
}

/* ── PARTICLE BURST ── */
function Particles({ count }: { count: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const dist = 150 + Math.random() * 300;
      const size = 1 + Math.random() * 3;
      return { angle, dist, size, duration: 0.6 + Math.random() * 0.6 };
    }), []);

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-[#D4AF37]"
          initial={{
            width: p.size,
            height: p.size,
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: p.duration, ease: "easeOut" }}
          onUpdate={noop}
          style={{ boxShadow: "0 0 4px #D4AF37" }}
        />
      ))}
    </>
  );
}

/* ── VERSE COUNTER (The Gita Progress Indicator) ── */
const VERSE_WORDS = ["कर्मण्येवाधिकारस्ते", "मा", "फलेषु", "कदाचन"];
const PHILOSOPHY_PARTS = [
  "Action is the seed.",
  "Result is the fruit.",
  "We architect both."
];

function VerseCounter({ totalDuration, phase }: { totalDuration: number; phase: string }) {
  const [count, setCount] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(100, Math.round((elapsed / (totalDuration * 1000)) * 100));
      setCount(progress);
      if (progress < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { active = false; };
  }, [totalDuration]);

  // Word reveal delays (synced to geometry phases)
  const wordDelays = [0.3, 1.4, 2.4, 3.2];
  // Philosophy sentence delays (staggered after last verse word)
  const philoDelays = [3.5, 4.0, 4.5];

  return (
    <motion.div
      className="absolute bottom-8 md:bottom-12 left-0 right-0 flex flex-col items-center gap-3 z-10 px-6"
      initial={{ opacity: 0 }}
      animate={
        phase === "collapse" || phase === "brand"
          ? { opacity: 0, y: -20 }
          : { opacity: 1 }
      }
      transition={
        phase === "collapse" || phase === "brand"
          ? { duration: 0.4 }
          : { duration: 0.5, delay: 0.2 }
      }
      onUpdate={noop}
    >
      {/* THE VERSE */}
      <div className="flex flex-wrap justify-center gap-x-2 md:gap-x-3">
        {VERSE_WORDS.map((word, i) => (
          <motion.span
            key={`verse-word-${word}-${i}`}
            className="inline-block text-sm md:text-lg font-[var(--font-gotu)] tracking-wide"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: wordDelays[i],
              ease: [0.22, 1, 0.36, 1],
            }}
            onUpdate={noop}
            style={{ color: "#D4AF37" }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* GITA CITATION */}
      <motion.p
        className="text-[8px] md:text-[10px] font-[var(--font-cinzel)] text-[#C0C0C0]/30 tracking-[0.3em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 3.4 }}
        onUpdate={noop}
      >
        — Bhagavad Gita, 2.47
      </motion.p>

      {/* DIVIDER LINE */}
      <motion.div
        className="w-20 md:w-32 h-[1px]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onUpdate={noop}
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }}
      />

      {/* THE PHILOSOPHY STATEMENT */}
      <div className="flex flex-col items-center gap-1">
        {PHILOSOPHY_PARTS.map((line, i) => (
          <motion.span
            key={`philo-part-${i}`}
            className={`inline-block text-[10px] md:text-xs tracking-[0.25em] ${i === 2
              ? "font-[var(--font-cinzel)] font-bold text-white/90"
              : "font-[var(--font-cinzel)] text-[#C0C0C0]/60"
              }`}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: philoDelays[i],
              ease: [0.22, 1, 0.36, 1],
            }}
            onUpdate={noop}
          >
            {line}
          </motion.span>
        ))}
      </div>

      {/* PERCENTAGE */}
      <motion.span
        className="text-[10px] md:text-xs font-[var(--font-mono)] tracking-[0.5em] tabular-nums text-[#D4AF37]/50 mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onUpdate={noop}
      >
        {String(count).padStart(3, "\u00A0")}
      </motion.span>
    </motion.div>
  );
}

/* ── MAIN PRELOADER ── */
export default function Preloader({ onReveal }: { onReveal?: () => void }) {
  const [phase, setPhase] = useState<"draw" | "flash" | "collapse" | "brand" | "done">("draw");
  const isLowEnd = useIsLowEnd();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flash"), 5200);
    const t2 = setTimeout(() => setPhase("collapse"), 5600);
    const t3 = setTimeout(() => {
      setPhase("done");
      if (onReveal) onReveal();
    }, 6400); // 800ms after collapse starts, ending the preloader
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onReveal]);

  // Lock scrolling while preloader is active
  useEffect(() => {
    if (phase !== "done") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup if component unmounts early
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[999] bg-[#010101] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onUpdate={noop}
          style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", WebkitTransform: "translateZ(0)" }}
        >
          {/* OPTICAL CENTERING WRAPPER (Shifts content up on tall mobile screens) */}
          <div className="absolute inset-0 flex items-center justify-center -translate-y-[6vh] md:translate-y-0">
            {/* ── VERSE COUNTER ── */}
            {(phase === "draw" || phase === "flash") && (
              <VerseCounter totalDuration={6.0} phase={phase} />
            )}

            {/* ── THE LIVING BINDU (HEARTBEAT) ── */}
            {(phase === "draw" || phase === "flash") && (
              <motion.div
                className="absolute"
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                onUpdate={noop}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#D4AF37",
                  boxShadow: "0 0 20px #D4AF37, 0 0 50px rgba(212,175,55,0.4)",
                }}
              />
            )}

            {/* ── SHOCKWAVE RING (on collapse) ── */}
            {(phase === "collapse" || phase === "brand") && (
              <motion.div
                className="absolute rounded-full"
                initial={{ width: 10, height: 10, opacity: 0.9 }}
                animate={{ width: "250vmax", height: "250vmax", opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                onUpdate={noop}
                style={{
                  border: "1px solid #D4AF37",
                  boxShadow: "0 0 40px rgba(212,175,55,0.4), inset 0 0 40px rgba(212,175,55,0.2)",
                }}
              />
            )}

            {/* ── PARTICLE BURST (on collapse) ── */}
            {phase === "collapse" && <Particles count={isLowEnd ? 20 : 40} />}

            {/* ── THE GENESIS SVG (with slow rotation) ── */}
            {(phase === "draw" || phase === "flash" || phase === "collapse") && (
              <motion.div
                className="w-[65vmin] h-[65vmin] max-w-[480px] max-h-[480px]"
                animate={
                  phase === "flash"
                    ? { filter: "brightness(4) drop-shadow(0 0 80px rgba(212,175,55,1))", rotate: 25 }
                    : phase === "collapse"
                      ? { scale: 0, opacity: 0, rotate: 30 }
                      : { rotate: 30 }
                }
                transition={
                  phase === "flash"
                    ? { filter: { duration: 0.3 }, rotate: { duration: 3.8, ease: "linear" } }
                    : phase === "collapse"
                      ? { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
                      : { rotate: { duration: 5, ease: "linear" } }
                }
                initial={{ rotate: 0 }}
                onUpdate={noop}
              >
                <svg viewBox="0 0 1000 1000" className="w-full h-full">
                  {/* ORIGIN POINT */}
                  <motion.circle cx="500" cy="500" r="4" fill="#D4AF37"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}
                    onUpdate={noop}
                  />

                  {/* PHASE 1: CIRCLES — SLOW to FAST (exponential speed ramp) */}
                  <ACircle cx={500} cy={500} r={80} delay={0.3} duration={1.5} />
                  <ACircle cx={500} cy={500} r={180} delay={1.0} duration={1.0} />
                  <ACircle cx={500} cy={500} r={280} delay={1.5} duration={0.7} />
                  <ACircle cx={500} cy={500} r={380} delay={1.9} duration={0.5} />
                  <ACircle cx={500} cy={500} r={470} delay={2.1} duration={0.4} sw={0.4} />
                  <ACircle cx={500} cy={500} r={480} delay={2.2} duration={0.35} sw={0.6} />

                  {/* PHASE 2: TRIANGLES — RAPID */}
                  <APoly points="500,120 820,700 180,700" delay={2.5} duration={0.35} />
                  <APoly points="500,880 180,300 820,300" delay={2.65} duration={0.3} />
                  <APoly points="500,200 740,640 260,640" delay={2.8} duration={0.25} />
                  <APoly points="500,800 260,360 740,360" delay={2.9} duration={0.25} />
                  <APoly points="500,280 660,580 340,580" delay={2.95} duration={0.2} />
                  <APoly points="500,720 340,420 660,420" delay={3.0} duration={0.2} />

                  {/* PHASE 3: LINES — FAST SLASH */}
                  <ALine x1={500} y1={20} x2={500} y2={980} delay={3.1} duration={0.2} />
                  <ALine x1={20} y1={500} x2={980} y2={500} delay={3.15} duration={0.2} />
                  <ALine x1={146} y1={146} x2={854} y2={854} delay={3.2} duration={0.15} />
                  <ALine x1={854} y1={146} x2={146} y2={854} delay={3.25} duration={0.15} />

                  {/* PHASE 4: LOTUS — MACHINE GUN */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
                    <AEllipse key={`o${a}`} cx={500} cy={350} rx={30} ry={100} rot={a} delay={3.3 + i * 0.04} duration={0.15} />
                  ))}
                  {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((a, i) => (
                    <AEllipse key={`i${a}`} cx={500} cy={400} rx={20} ry={60} rot={a} delay={3.5 + i * 0.03} duration={0.12} />
                  ))}

                  {/* FINAL BINDU GLOW */}
                  <motion.circle cx="500" cy="500" r="10" fill="#D4AF37"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
                    transition={{ duration: 0.2, delay: 3.7 }}
                    onUpdate={noop}
                  />
                </svg>
              </motion.div>
            )}

            {/* ── BRAND NAME + PHILOSOPHY (after collapse) ── */}
          </div> END OPTICAL CENTERING WRAPPER

          {/* ── AMBIENT GLOW (Outside centering wrapper because it's absolute fixed anyway) ── */}
          <motion.div
            className="absolute pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={
              phase === "flash"
                ? { opacity: 0.8, scale: 2 }
                : phase === "collapse" || phase === "brand"
                  ? { opacity: 0, scale: 3 }
                  : { opacity: 0.12 }
            }
            transition={{ duration: phase === "flash" ? 0.3 : 0.8, delay: phase === "draw" ? 0.5 : 0 }}
            onUpdate={noop}
            style={{
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
