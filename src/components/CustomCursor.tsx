"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let animating = true;

    // Smooth follow loop using RAF + lerp (no React state)
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    function animate() {
      if (!animating) return;
      currentX = lerp(currentX, mouseX, 0.15);
      currentY = lerp(currentY, mouseY, 0.15);
      if (outer) outer.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      if (inner) inner.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (outer) outer.style.opacity = "1";
      if (inner) inner.style.opacity = "1";
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest("a, button, input, [role='button']") !== null;
      if (isClickable !== hovering.current) {
        hovering.current = isClickable;
        if (outer) {
          outer.style.width = isClickable ? "48px" : "24px";
          outer.style.height = isClickable ? "48px" : "24px";
          outer.style.borderColor = isClickable ? "#D4AF37" : "rgba(212,175,55,0.5)";
          outer.style.backgroundColor = isClickable ? "rgba(212,175,55,0.08)" : "transparent";
        }
        if (inner) inner.style.opacity = isClickable ? "0" : "1";
      }
    };

    const hide = () => {
      if (outer) outer.style.opacity = "0";
      if (inner) inner.style.opacity = "0";
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", checkHover, { passive: true });
    document.addEventListener("mouseleave", hide);

    // Hide default cursor
    document.documentElement.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    requestAnimationFrame(animate);

    return () => {
      animating = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", checkHover);
      document.removeEventListener("mouseleave", hide);
      document.documentElement.style.cursor = "";
      style.remove();
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Outer ring — follows with lerp delay */}
      <div
        ref={outerRef}
        className="fixed z-[1000] pointer-events-none top-0 left-0 rounded-full border border-[rgba(212,175,55,0.5)]"
        style={{
          width: "24px",
          height: "24px",
          opacity: 0,
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease",
          willChange: "transform",
        }}
      />
      {/* Inner dot — follows instantly */}
      <div
        ref={innerRef}
        className="fixed z-[1000] pointer-events-none top-0 left-0 w-1 h-1 rounded-full bg-[#D4AF37]"
        style={{
          opacity: 0,
          willChange: "transform",
        }}
      />
    </>
  );
}
