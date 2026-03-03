"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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

const GeometrySVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1000 1000" className={className}>
    {/* Outer circle */}
    <circle cx="500" cy="500" r="480" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
    <circle cx="500" cy="500" r="470" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
    {/* Middle rings */}
    <circle cx="500" cy="500" r="380" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
    <circle cx="500" cy="500" r="280" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
    <circle cx="500" cy="500" r="180" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
    <circle cx="500" cy="500" r="80" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
    {/* Upward triangles */}
    <polygon points="500,120 820,700 180,700" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
    <polygon points="500,200 740,640 260,640" fill="none" stroke="#D4AF37" strokeWidth="0.4" />
    <polygon points="500,280 660,580 340,580" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
    {/* Downward triangles */}
    <polygon points="500,880 180,300 820,300" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
    <polygon points="500,800 260,360 740,360" fill="none" stroke="#D4AF37" strokeWidth="0.4" />
    <polygon points="500,720 340,420 660,420" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
    {/* Cardinal lines */}
    <line x1="500" y1="20" x2="500" y2="980" stroke="#D4AF37" strokeWidth="0.3" />
    <line x1="20" y1="500" x2="980" y2="500" stroke="#D4AF37" strokeWidth="0.3" />
    {/* Diagonal lines */}
    <line x1="146" y1="146" x2="854" y2="854" stroke="#D4AF37" strokeWidth="0.2" />
    <line x1="854" y1="146" x2="146" y2="854" stroke="#D4AF37" strokeWidth="0.2" />
    {/* Lotus petals (8) */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <ellipse key={angle} cx="500" cy="350" rx="30" ry="100" fill="none" stroke="#D4AF37" strokeWidth="0.4" transform={`rotate(${angle} 500 500)`} />
    ))}
    {/* Inner lotus petals (8) */}
    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
      <ellipse key={angle} cx="500" cy="400" rx="20" ry="60" fill="none" stroke="#D4AF37" strokeWidth="0.3" transform={`rotate(${angle} 500 500)`} />
    ))}
    {/* Center bindu */}
    <circle cx="500" cy="500" r="8" fill="#D4AF37" opacity="0.3" />
    <circle cx="500" cy="500" r="3" fill="#D4AF37" opacity="0.6" />
  </svg>
);

export default function SacredGeometry() {
  const isMobile = useIsMobile();

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden flex items-center justify-center">
      {/* BASE LAYER — always faintly visible */}
      <motion.div
        className="w-[140vh] h-[140vh] opacity-[0.04]"
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: isMobile ? 0.50 : 0.20, rotate: 0 }}
        transition={{ duration: 4, delay: 1, ease: "easeOut" }}
      >
        <GeometrySVG className="w-full h-full" />
      </motion.div>

      {/* TORCH-REVEALED LAYER — glows where cursor is */}
      <div
        className="absolute w-[140vh] h-[140vh] transition-opacity duration-700"
        style={{
          opacity: "var(--torch-opacity, 0)",
          maskImage: "radial-gradient(500px circle at var(--torch-x, -500px) var(--torch-y, -500px), black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(500px circle at var(--torch-x, -500px) var(--torch-y, -500px), black 0%, transparent 70%)",
        }}
      >
        <GeometrySVG className="w-full h-full opacity-[0.2]" />
      </div>
    </div>
  );
}
