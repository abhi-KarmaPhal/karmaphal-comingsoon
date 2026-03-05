"use client";

import { useEffect, useRef } from "react";

/**
 * DivineEmbers
 *
 * Sparse, slowly rising golden motes — like incense smoke or diya sparks.
 * Canvas-based for zero DOM overhead. Runs only after `revealed` = true.
 *
 * DROP-IN: Add <DivineEmbers revealed={revealed} /> inside MonolithHero,
 * as a sibling of DivineTorch. It renders a fixed canvas behind everything.
 *
 * Props:
 *   revealed: boolean — pass the same `revealed` state from MonolithHero
 *   count?: number    — max simultaneous particles (default 18)
 */

interface Ember {
  x: number;
  y: number;
  vy: number;      // rise speed
  vx: number;      // gentle horizontal drift
  size: number;
  opacity: number;
  maxOpacity: number;
  life: number;    // 0..1
  phase: "in" | "hold" | "out";
  phaseProgress: number;
}

interface Props {
  revealed: boolean;
  count?: number;
}

function randomEmber(W: number, H: number): Ember {
  return {
    x: Math.random() * W,
    y: H + 10,
    vy: 0.18 + Math.random() * 0.35,
    vx: (Math.random() - 0.5) * 0.3,
    size: 0.8 + Math.random() * 2.2,
    opacity: 0,
    maxOpacity: 0.25 + Math.random() * 0.45,
    life: 0,
    phase: "in",
    phaseProgress: 0,
  };
}

export default function DivineEmbers({ revealed, count = 18 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const embersRef = useRef<Ember[]>([]);
  const revealedRef = useRef(false);

  useEffect(() => {
    revealedRef.current = revealed;
  }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;

    // PRE-RENDER GLOW TO OFFSCREEN CANVAS
    // Calculating radial gradients 60 times/sec per particle kills Safari performance.
    // Instead, we render the 'ideal' ember once offscreen and stamp it via drawImage.
    const offCanvas = document.createElement("canvas");
    const glowRadius = 40;
    offCanvas.width = glowRadius * 2;
    offCanvas.height = glowRadius * 2;
    const offCtx = offCanvas.getContext("2d")!;
    const grd = offCtx.createRadialGradient(glowRadius, glowRadius, 0, glowRadius, glowRadius, glowRadius);
    grd.addColorStop(0, "rgba(212,175,55,1)");
    grd.addColorStop(0.4, "rgba(212,175,55,0.4)");
    grd.addColorStop(1, "rgba(212,175,55,0)");
    offCtx.fillStyle = grd;
    offCtx.fillRect(0, 0, glowRadius * 2, glowRadius * 2);

    // Core bright dot
    offCtx.beginPath();
    offCtx.arc(glowRadius, glowRadius, glowRadius * 0.17, 0, Math.PI * 2);
    offCtx.fillStyle = "rgba(255,240,180,1)";
    offCtx.fill();

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    let lastSpawn = 0;

    const tick = (now: number) => {
      animRef.current = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, W, H);

      if (!revealedRef.current) return;

      // Spawn new embers gradually
      if (embersRef.current.length < count && now - lastSpawn > 600 + Math.random() * 800) {
        embersRef.current.push(randomEmber(W, H));
        lastSpawn = now;
      }

      // Update + draw
      embersRef.current = embersRef.current.filter(e => e.y > -20);

      // NATIVE CANVAS BLEND MODE (Thousands of times faster than CSS mix-blend-mode)
      ctx.globalCompositeOperation = "screen";

      for (const e of embersRef.current) {
        // Move
        e.x += e.vx + Math.sin(e.life * 4) * 0.15; // gentle sinusoidal sway
        e.y -= e.vy;
        e.life += e.vy / H;

        // Fade in over first 15% of life, hold, fade out last 25%
        if (e.life < 0.15) {
          e.opacity = (e.life / 0.15) * e.maxOpacity;
        } else if (e.life > 0.75) {
          e.opacity = ((1 - e.life) / 0.25) * e.maxOpacity;
        } else {
          e.opacity = e.maxOpacity;
        }

        // Draw cached ember applying opacity via globalAlpha
        ctx.globalAlpha = e.opacity;
        const renderSize = e.size * 3.5;
        // The offCanvas glowRadius is 40. We scale it down to match the ember's dynamic size.
        ctx.drawImage(offCanvas, e.x - renderSize, e.y - renderSize, renderSize * 2, renderSize * 2);
      }
      // Reset alpha for safety
      ctx.globalAlpha = 1.0;
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[3] pointer-events-none"
    />
  );
}
