import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildWelcomeHTML(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]><style>body,table,td{font-family:Georgia,serif !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#010101;font-family:Georgia,'Times New Roman',serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#010101;">
    <tr>
      <td align="center" style="padding:0;">

        <!-- OUTER WRAPPER -->
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

          <!-- TOP GOLD ACCENT BAR -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#010101,#D4AF37,#010101);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- SPACER -->
          <tr><td style="height:50px;"></td></tr>

          <!-- LOGO -->
          <tr>
            <td align="center" style="padding:0 0 8px;">
              <span style="font-size:38px;color:#D4AF37;letter-spacing:2px;">कर्म</span>
              <span style="font-size:14px;color:#D4AF37;vertical-align:middle;margin:0 6px;">·</span>
              <span style="font-size:32px;color:#D4AF37;font-weight:900;letter-spacing:8px;text-transform:uppercase;font-family:Georgia,'Times New Roman',serif;">PHAL</span>
            </td>
          </tr>

          <!-- TAGLINE UNDER LOGO -->
          <tr>
            <td align="center" style="padding:4px 0 0;">
              <p style="margin:0;font-size:9px;color:#D4AF37;letter-spacing:6px;text-transform:uppercase;opacity:0.6;">
                Architecture of the Infinite
              </p>
            </td>
          </tr>

          <!-- GOLD LINE -->
          <tr>
            <td align="center" style="padding:28px 0 32px;">
              <div style="width:100px;height:1px;background:linear-gradient(90deg,transparent,#D4AF37,transparent);"></div>
            </td>
          </tr>

          <!-- HEADING -->
          <tr>
            <td align="center" style="padding:0 30px 8px;">
              <h1 style="margin:0;font-size:28px;font-weight:400;color:#FFFFFF;letter-spacing:10px;text-transform:uppercase;">
                You're In
              </h1>
            </td>
          </tr>

          <!-- SUB-HEADING -->
          <tr>
            <td align="center" style="padding:0 30px 28px;">
              <p style="margin:0;font-size:12px;color:#D4AF37;letter-spacing:4px;text-transform:uppercase;font-weight:700;">
                This isn't for everyone
              </p>
            </td>
          </tr>

          <!-- BODY — THE MANIFESTO -->
          <tr>
            <td align="center" style="padding:0 50px 20px;">
              <p style="margin:0;font-size:16px;line-height:2;color:#E0E0E0;letter-spacing:0.3px;">
                Your brand deserves to be extraordinary. That's exactly what we build.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 50px 20px;">
              <p style="margin:0;font-size:15px;line-height:1.9;color:#C0C0C0;letter-spacing:0.3px;">
                We build brands that make people stop scrolling. Identities that command attention.
                Digital experiences so refined, your competitors wonder who's behind them.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 50px 24px;">
              <p style="margin:0;font-size:15px;line-height:1.9;color:#C0C0C0;letter-spacing:0.3px;">
                If you're here, you already know — ordinary doesn't cut it. You want a brand that
                doesn't just exist, it <span style="color:#D4AF37;font-weight:700;">transcends</span>.
              </p>
            </td>
          </tr>

          <!-- GOLD DIVIDER -->
          <tr>
            <td align="center" style="padding:8px 0 28px;">
              <div style="width:40px;height:1px;background:linear-gradient(90deg,transparent,#D4AF37,transparent);"></div>
            </td>
          </tr>

          <!-- WHAT WE DO — CAPABILITY STRIP -->
          <tr>
            <td align="center" style="padding:0 40px 10px;">
              <p style="margin:0;font-size:9px;color:#666;letter-spacing:5px;text-transform:uppercase;">
                What We Architect
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 30px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="padding:10px 14px;">
                    <p style="margin:0;font-size:11px;color:#D4AF37;letter-spacing:3px;text-transform:uppercase;text-align:center;">Brands</p>
                  </td>
                  <td style="padding:10px 4px;color:#333;">·</td>
                  <td style="padding:10px 14px;">
                    <p style="margin:0;font-size:11px;color:#D4AF37;letter-spacing:3px;text-transform:uppercase;text-align:center;">Websites</p>
                  </td>
                  <td style="padding:10px 4px;color:#333;">·</td>
                  <td style="padding:10px 14px;">
                    <p style="margin:0;font-size:11px;color:#D4AF37;letter-spacing:3px;text-transform:uppercase;text-align:center;">Apps</p>
                  </td>
                  <td style="padding:10px 4px;color:#333;">·</td>
                  <td style="padding:10px 14px;">
                    <p style="margin:0;font-size:11px;color:#D4AF37;letter-spacing:3px;text-transform:uppercase;text-align:center;">AI</p>
                  </td>
                  <td style="padding:10px 4px;color:#333;">·</td>
                  <td style="padding:10px 14px;">
                    <p style="margin:0;font-size:11px;color:#D4AF37;letter-spacing:3px;text-transform:uppercase;text-align:center;">Decentralized Systems</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- GOLD LINE -->
          <tr>
            <td align="center" style="padding:0 0 28px;">
              <div style="width:140px;height:1px;background:linear-gradient(90deg,transparent,#D4AF37,transparent);"></div>
            </td>
          </tr>

          <!-- THE HOOK — CTA SECTION -->
          <tr>
            <td align="center" style="padding:0 40px 12px;">
              <p style="margin:0;font-size:18px;color:#FFFFFF;letter-spacing:1px;font-weight:700;line-height:1.6;">
                Ready to take your brand seriously?
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 50px 28px;">
              <p style="margin:0;font-size:14px;color:#C0C0C0;letter-spacing:0.5px;line-height:1.8;">
                We're launching soon. When we do, you'll be first in line.
                But if you can't wait —
              </p>
            </td>
          </tr>

          <!-- CTA BUTTON -->
          <tr>
            <td align="center" style="padding:0 0 36px;">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="mailto:abhi@karmaphal.in?subject=Let%27s%20Build%20Something%20Insane" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="50%" strokecolor="#D4AF37" strokeweight="1px" fillcolor="#010101">
              <w:anchorlock/>
              <center style="color:#D4AF37;font-family:Georgia,serif;font-size:11px;font-weight:bold;letter-spacing:4px;text-transform:uppercase;">Talk To Us →</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-->
              <a href="mailto:abhi@karmaphal.in?subject=Let%27s%20Build%20Something%20Insane" style="display:inline-block;padding:14px 40px;border:1px solid #D4AF37;border-radius:30px;color:#D4AF37;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;text-decoration:none;font-family:Georgia,'Times New Roman',serif;transition:all 0.3s;">
                Talk To Us →
              </a>
              <!--<![endif]-->
            </td>
          </tr>

          <!-- PHILOSOPHY QUOTE -->
          <tr>
            <td align="center" style="padding:0 0 8px;">
              <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#D4AF37,transparent);"></div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 50px 6px;">
              <p style="margin:0;font-size:13px;color:#888;letter-spacing:1px;font-style:italic;line-height:1.6;">
                "Action is the seed. Result is the fruit."
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 50px 32px;">
              <p style="margin:0;font-size:14px;color:#FFFFFF;letter-spacing:2px;font-weight:700;">
                We architect both.
              </p>
            </td>
          </tr>

          <!-- SPACER -->
          <tr><td style="height:20px;"></td></tr>

          <!-- BOTTOM GOLD ACCENT -->
          <tr>
            <td align="center" style="padding:0 0 20px;">
              <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#D4AF37,transparent);"></div>
            </td>
          </tr>

          <!-- SOCIAL LINKS -->
          <tr>
            <td align="center" style="padding:0 0 16px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 12px;">
                    <a href="https://www.linkedin.com/company/houseofkarmaphal/" target="_blank" style="color:#666;text-decoration:none;font-size:11px;letter-spacing:2px;">LinkedIn</a>
                  </td>
                  <td style="color:#333;font-size:10px;">·</td>
                  <td style="padding:0 12px;">
                    <a href="https://www.instagram.com/houseofkarmaphal/" target="_blank" style="color:#666;text-decoration:none;font-size:11px;letter-spacing:2px;">Instagram</a>
                  </td>
                  <td style="color:#333;font-size:10px;">·</td>
                  <td style="padding:0 12px;">
                    <a href="https://karmaphal.in" target="_blank" style="color:#666;text-decoration:none;font-size:11px;letter-spacing:2px;">karmaphal.in</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding:8px 0 40px;">
              <p style="margin:0;font-size:10px;color:#444;letter-spacing:3px;text-transform:uppercase;">
                © 2026 KarmaPhal · All Rights Reserved
              </p>
            </td>
          </tr>

          <!-- BOTTOM GOLD ACCENT BAR -->
          <tr>
            <td style="height:2px;background:linear-gradient(90deg,#010101,#D4AF37,#010101);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail(to: string): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured — skipping welcome email");
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"KarmaPhal" <${process.env.SMTP_USER}>`,
      to,
      subject: "You're in · KarmaPhal",
      text: "You're in.\n\nYour brand deserves to be extraordinary. That's exactly what we build. We build brands that make people stop scrolling. Identities that command attention. Digital experiences so refined, your competitors wonder who's behind them.\n\nIf you're here, you already know — ordinary doesn't cut it. You want a brand that doesn't just exist, it transcends.\n\nWhat We Architect: Brands · Websites · Apps · AI · Decentralized Systems\n\nReady to take your brand seriously? We're launching soon. When we do, you'll be first in line.\n\nAction is the seed. Result is the fruit. We architect both.\n\nTalk To Us: abhi@karmaphal.in",
      html: buildWelcomeHTML(),
    });
    console.log(`✅ Welcome email sent to ${to}`);
    return true;
  } catch (err) {
    console.error("❌ Email send failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
