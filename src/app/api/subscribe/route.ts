import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

// ── CONFIG ──
const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || "";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, source, ip_address } = data;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required." }, { status: 400 });
    }

    // 1. GOOGLE SHEETS BRIDGE
    let bridgeSuccess = false;
    try {
        const response = await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            body: JSON.stringify({ email, source, ip_address }),
            headers: { "Content-Type": "application/json" }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.status === "duplicate") {
                return NextResponse.json({ success: true, message: "Already on the list!", type: "duplicate" });
            }
            bridgeSuccess = true;
        }
    } catch (err) {
        console.error("Bridge Error:", err);
        // Continue to email even if bridge fails for maximum lead capture
    }

    // 2. SEND WELCOME EMAIL (HARD-AWAIT FOR RELIABILITY)
    try {
      await sendWelcomeEmail(email);
    } catch (emailErr) {
      console.error("Email delivery failed:", emailErr);
    }

    return NextResponse.json({ success: true, message: "You're on the list! We'll notify you.", type: "success" });

  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json({ success: false, message: "Vault connection error." }, { status: 500 });
  }
}
