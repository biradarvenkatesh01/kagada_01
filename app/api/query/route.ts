import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

// Helper to safely format from-email even if raw domain is passed
function resolveFromEmail(raw?: string): string {
  const val = (raw || process.env.RESEND_FROM_EMAIL || "").trim().replace(/^["']|["']$/g, "");
  if (!val) {
    return "Kagada Queries <onboarding@resend.dev>";
  }
  // If raw domain without an @ was passed, e.g. "Kagada Queries <kagada2026.live>" or "kagada2026.live"
  if (!val.includes("@")) {
    const domainMatch = val.match(/<([^>]+)>/) || [null, val];
    const domain = (domainMatch[1] || val).trim().replace(/[<>]/g, "");
    return `Kagada Queries <queries@${domain}>`;
  }
  return val;
}

interface QueryPayload {
  firstName: string;
  lastName?: string;
  email: string;
  message: string;
}

// Persistence helper to ensure zero queries are lost
function saveQueryLocally(payload: QueryPayload) {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, "queries.json");
    let existing: any[] = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      try {
        existing = JSON.parse(raw);
        if (!Array.isArray(existing)) existing = [];
      } catch {
        existing = [];
      }
    }

    const newRecord = {
      id: `query_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...payload,
    };

    existing.unshift(newRecord);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to save query to queries.json:", err);
    return false;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderQueryEmailHtml({
  name,
  email,
  message,
  time,
}: {
  name: string;
  email: string;
  message: string;
  time: string;
}): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);
  const preview = escapeHtml(message.slice(0, 90) + (message.length > 90 ? "..." : ""));

  const cleanEmail = email.trim();
  const formalSubject = encodeURIComponent(`[KAGADA 2026] Regarding Your Query`);
  const formalBody = encodeURIComponent(
    `Dear ${name},\n\n` +
    `Thank you for reaching out to IEEE UVCE.\n\n` +
    `Regarding your query:\n` +
    `[Type your response here]\n\n` +
    `If you have any further questions or require additional details, please feel free to let us know.\n\n` +
    `Warm regards,\n` +
    `IEEE UVCE\n` +
    `IEEE UVCE Student Branch • Bengaluru\n` +
    `https://kagada2026.live`
  );
  const replyMailtoUrl = `mailto:${cleanEmail}?to=${cleanEmail}&subject=${formalSubject}&body=${formalBody}`;

  return `
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">
  ${safeName} — ${preview}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">

        <!-- header -->
        <tr>
          <td style="background-color:#8a1c1c;padding:24px 28px;">
            <p style="margin:0 0 4px 0;color:#e8b4b4;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">
              New Query
            </p>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">
              KAGADA 2026
            </h1>
            <p style="margin:6px 0 0 0;color:#e8b4b4;font-size:13px;">
              via kagada2026.live
            </p>
          </td>
        </tr>

        <!-- sender details -->
        <tr>
          <td style="padding:28px 28px 8px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 0 14px 0;">
                  <p style="margin:0 0 2px 0;color:#94a3b8;font-size:11px;letter-spacing:0.8px;text-transform:uppercase;font-weight:700;">From</p>
                  <p style="margin:0;color:#0f172a;font-size:17px;font-weight:600;">${safeName}</p>
                  <a href="${replyMailtoUrl}" style="color:#8a1c1c;font-size:14px;text-decoration:none;">${safeEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:0 0 20px 0;">
                  <p style="margin:0 0 2px 0;color:#94a3b8;font-size:11px;letter-spacing:0.8px;text-transform:uppercase;font-weight:700;">Received</p>
                  <p style="margin:0;color:#475569;font-size:14px;">${time} IST</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- message -->
        <tr>
          <td style="padding:0 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:10px;border-left:4px solid #8a1c1c;">
              <tr>
                <td style="padding:18px 20px;">
                  <p style="margin:0 0 10px 0;color:#94a3b8;font-size:11px;letter-spacing:0.8px;text-transform:uppercase;font-weight:700;">Message</p>
                  <p style="margin:0;color:#0f172a;font-size:15px;line-height:1.65;white-space:pre-wrap;">${safeMessage}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- reply button -->
        <tr>
          <td style="padding:24px 28px 28px 28px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:#8a1c1c;border-radius:8px;">
                  <a href="${replyMailtoUrl}"
                     style="display:inline-block;padding:12px 26px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
                    Reply to ${safeName}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- footer -->
        <tr>
          <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 28px;text-align:center;">
            <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">
              Replying to this email also reaches ${safeName} directly.<br />
              <strong style="color:#475569;">IEEE UVCE Student Branch</strong> · Bengaluru
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, message } = body;

    // 1. Validation
    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return NextResponse.json(
        { error: "First name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Query message is required." },
        { status: 400 }
      );
    }

    const cleanPayload: QueryPayload = {
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : "",
      email: email.trim(),
      message: message.trim(),
    };

    // 2. Always persist locally as primary fail-safe
    saveQueryLocally(cleanPayload);

    // 3. Dispatch email via Resend if API key is configured
    let emailSent = false;
    let resendError = null;

    const resendApiKey = process.env.RESEND_API_KEY;
    const resend = resendApiKey ? new Resend(resendApiKey) : null;
    const notificationEmail =
      process.env.CONTACT_NOTIFICATION_EMAIL || "kagada.ieeeuvce@gmail.com";
    const fromEmail = resolveFromEmail(process.env.RESEND_FROM_EMAIL);

    if (resend) {
      try {
        const fullName = `${cleanPayload.firstName} ${cleanPayload.lastName}`.trim();
        const timeString = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        const emailHtml = renderQueryEmailHtml({
          name: fullName,
          email: cleanPayload.email,
          message: cleanPayload.message,
          time: timeString,
        });

        const initialResult = await resend.emails.send({
          from: fromEmail,
          to: [notificationEmail],
          replyTo: cleanPayload.email,
          subject: `[KAGADA 2026 Query] from ${fullName}`,
          html: emailHtml,
        });

        let sendError = initialResult.error;

        // Smart Sandbox Fallback: If free tier restricts to registered owner email, extract and retry
        if (sendError && sendError.message.includes("You can only send testing emails to your own email address")) {
          const match = sendError.message.match(/\(([^)]+)\)/);
          if (match && match[1]) {
            const registeredEmail = match[1];
            console.log(`Resend Sandbox Mode: Retrying delivery to registered account owner (${registeredEmail})...`);
            const retryResult = await resend.emails.send({
              from: fromEmail,
              to: [registeredEmail],
              replyTo: cleanPayload.email,
              subject: `[KAGADA 2026 Query] from ${fullName}`,
              html: emailHtml,
            });
            sendError = retryResult.error;
            if (!sendError) {
              emailSent = true;
              console.log(`Query email successfully delivered to registered Resend account (${registeredEmail})!`);
            }
          }
        }

        if (sendError) {
          console.error("Resend delivery failed:", sendError);
          resendError = sendError.message;
        } else {
          emailSent = true;
          console.log(
            `[Query API] Query email successfully delivered to ${notificationEmail} via Resend (ID: ${initialResult.data?.id})`
          );
        }
      } catch (err: any) {
        console.error("Resend API exception:", err);
        resendError = err.message;
      }
    } else {
      console.log(
        "RESEND_API_KEY is not configured. Query successfully saved to data/queries.json."
      );
    }

    return NextResponse.json({
      success: true,
      emailSent,
      resendError,
      message: "Your query has been submitted successfully!",
    });
  } catch (error: any) {
    console.error("Query API unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing query." },
      { status: 500 }
    );
  }
}
