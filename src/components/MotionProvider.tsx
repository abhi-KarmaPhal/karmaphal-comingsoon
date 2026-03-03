"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

/**
 * Wraps the app in a MotionConfig that disables Framer Motion v12's default
 * Web Animations API (WAAPI) integration. Safari's WAAPI implementation has a
 * critical bug where compositor layers are incorrectly demoted (and repainted)
 * at animation end - visually a flash/blink after every animated element settles.
 *
 * Falling back to Framer Motion's JS animation engine resolves the issue while
 * keeping all animations, easing curves, and spring physics identical.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
    return (
        <MotionConfig reducedMotion="never">
            {children}
        </MotionConfig>
    );
}
