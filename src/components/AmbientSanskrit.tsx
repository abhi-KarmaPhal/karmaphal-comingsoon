"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// No-op: forces Framer Motion JS engine (Safari iOS blink fix)
const noop = () => { };

/**
 * AmbientSanskrit
 *
 * Ultra-faint Devanagari words that slowly drift, rotate, and pulse
 * in the background — adding dimensional Hindu cultural depth.
 *
 * DROP-IN: Add <AmbientSanskrit /> inside your hero section's absolute
 * layer stack, after SacredGeometry, before the content div.
 * z-index is set to z-[1] — sits behind geometry, never blocks anything.
 */

const WORDS = [
  { text: "कर्म", size: "8rem", x: "8%", y: "12%", rot: -12, delay: 0.5, dur: 22 },
  { text: "सत्यम्", size: "5rem", x: "78%", y: "8%", rot: 8, delay: 1.2, dur: 28 },
  { text: "ॐ", size: "11rem", x: "88%", y: "55%", rot: 0, delay: 0.2, dur: 34 },
  { text: "तपस्", size: "4.5rem", x: "5%", y: "72%", rot: 15, delay: 2.0, dur: 26 },
  { text: "कर्म", size: "9rem", x: "60%", y: "80%", rot: -6, delay: 0.8, dur: 30 },
  { text: "शक्ति", size: "5.5rem", x: "25%", y: "88%", rot: 10, delay: 1.6, dur: 24 },
  { text: "ज्ञान", size: "6rem", x: "42%", y: "5%", rot: -4, delay: 3.0, dur: 32 },
];

export default function AmbientSanskrit() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
      {WORDS.map((word, i) => (
        <motion.div
          key={`sanskrit-${i}`}
          className="absolute select-none"
          style={{
            left: word.x,
            top: word.y,
            fontSize: word.size,
            fontFamily: "var(--font-gotu), serif",
            color: "#D4AF37",
            lineHeight: 1,
          }}
          // Entrance
          initial={{ opacity: 0, rotate: word.rot - 4, scale: 0.92 }}
          animate={{
            opacity: [0, 0.028, 0.018, 0.05, 0.02],
            rotate: [word.rot - 4, word.rot, word.rot + 3, word.rot - 1, word.rot],
            y: [0, -18, -6, -22, 0],
            scale: [0.92, 1, 1.02, 0.98, 1],
          }}
          transition={{
            duration: word.dur,
            delay: word.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
          onUpdate={noop}
        >
          {word.text}
        </motion.div>
      ))}
    </div>
  );
}
