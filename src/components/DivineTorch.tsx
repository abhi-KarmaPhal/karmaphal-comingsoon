"use client";

import { useEffect } from "react";

export default function DivineTorch() {
  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const root = document.documentElement;
    let animating = true;
    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    function animate() {
      if (!animating) return;
      currentX = lerp(currentX, mouseX, 0.08);
      currentY = lerp(currentY, mouseY, 0.08);
      root.style.setProperty("--torch-x", `${currentX}px`);
      root.style.setProperty("--torch-y", `${currentY}px`);
      requestAnimationFrame(animate);
    }

    const hide = () => {
      root.style.setProperty("--torch-opacity", "0");
    };
    const show = () => {
      root.style.setProperty("--torch-opacity", "1");
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    // Set initial state
    root.style.setProperty("--torch-opacity", "0");

    requestAnimationFrame(animate);

    return () => {
      animating = false;
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      root.style.removeProperty("--torch-x");
      root.style.removeProperty("--torch-y");
      root.style.removeProperty("--torch-opacity");
    };
  }, []);

  return (
    <>
      {/* THE TORCH GLOW — soft golden light following cursor */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none transition-opacity duration-700"
        style={{
          opacity: "var(--torch-opacity, 0)",
          background: "radial-gradient(600px circle at var(--torch-x, -500px) var(--torch-y, -500px), rgba(212,175,55,0.07) 0%, transparent 70%)",
          willChange: "background",
        }}
      />
    </>
  );
}
