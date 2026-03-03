"use server";

import { sendWelcomeEmail } from "@/lib/email";
import { headers } from "next/headers";

// ── CONFIG ──
const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || "";

// ── TYPES ──
interface SubscribeResult {
  success: boolean;
  message: string;
  type: "success" | "duplicate" | "error" | "bot";
}

// ── VALIDATION ──
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_EMAIL_LENGTH = 254;

const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com", "throwaway.email", "guerrillamail.com",
  "mailinator.com", "yopmail.com", "10minutemail.com",
  "trashmail.com", "fakeinbox.com", "sharklasers.com",
  "guerrillamailblock.com", "grr.la", "dispostable.com",
]);

// ── RATE LIMITING ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ── SERVER ACTION ──
export async function subscribeEmail(formData: FormData): Promise<SubscribeResult> {
  try {
    const honeypot = formData.get("website") as string;
    if (honeypot) return { success: true, message: "You're on the list!", type: "bot" };

    const rawEmail = formData.get("email") as string;
    if (!rawEmail) return { success: false, message: "Please enter your email.", type: "error" };
    
    const email = rawEmail.trim().toLowerCase();

    if (email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
      return { success: false, message: "Please enter a valid email.", type: "error" };
    }

    const domain = email.split("@")[1];
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return { success: false, message: "Please use a permanent email.", type: "error" };
    }

    const headList = await headers();
    const ip = headList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(ip)) {
      return { success: false, message: "Too many attempts. Try later.", type: "error" };
    }

    // ── GOOGLE SHEETS BRIDGE EXECUTION ──
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      body: JSON.stringify({
        email,
        source: "coming-soon",
        ip_address: ip
      }),
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("BRIDGE_NETWORK_FAILURE");

    const result = await response.json();

    if (result.status === "duplicate") {
      return { success: true, message: "You're already on the list!", type: "duplicate" };
    }

    if (result.status === "success") {
      sendWelcomeEmail(email).catch(() => {});
      return { success: true, message: "You're on the list! We'll notify you.", type: "success" };
    }

    throw new Error("BRIDGE_LOGIC_FAILURE");

  } catch (err) {
    console.error("Sovereign Bridge Error:", err);
    return { success: false, message: "Connection error. Please try again.", type: "error" };
  }
}
