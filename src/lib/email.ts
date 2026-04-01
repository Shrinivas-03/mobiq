import nodemailer from "nodemailer";

// ──────────────────────────────────────────────
// SMTP Transporter — supports Gmail or custom SMTP (GoDaddy, Hostinger, etc.)
// Configure via .env.local
// ──────────────────────────────────────────────
export function createTransporter() {
  const host = process.env.SMTP_HOST!;
  const port = parseInt(process.env.SMTP_PORT ?? "465");
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  const secure = process.env.SMTP_SECURE !== "false"; // default true (SSL)

  if (!host || !user || !pass) {
    throw new Error("Missing SMTP env vars: SMTP_HOST, SMTP_USER, SMTP_PASS");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

// ──────────────────────────────────────────────
// Label helpers
// ──────────────────────────────────────────────

const AGE_LABELS: Record<string, string> = {
  "0_3": "Below 3 months",
  "3_6": "3 – 6 months",
  "6_11": "6 – 11 months",
  "11_plus": "Above 11 months",
};

const HARDWARE_LABELS: Record<string, string> = {
  screen: "Broken/scratch on device screen",
  dead: "Dead Spot/Visible line and Discoloration",
  body: "Scratch/Dent on device body",
  panel: "Device panel missing/broken",
  touch: "Touch screen not working properly",
  button: "Missing volume or power button",
  bent: "Bent/curved panel",
  loose: "Loose screen (Gap in screen)",
};

const SOFTWARE_LABELS: Record<string, string> = {
  wifi: "Wifi not working",
  mic: "Speaker or microphone issue",
  faceid: "Face ID not working",
  charge: "Charging port not working",
  camera: "Camera front/back not working",
  bluetooth: "Bluetooth not working",
  fingerprint: "Fingerprint not working",
};

// ──────────────────────────────────────────────
// Email Data Interface
// ──────────────────────────────────────────────

export interface SellConfirmationEmailData {
  leadId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAltPhone?: string | null;
  customerAddress: string;

  brandName: string;
  modelName: string;
  variantName: string;
  city: string;
  deviceAge: string;
  mobileTurnsOn: boolean;

  accessories: { box: boolean; charger: boolean; invoice: boolean; warranty: boolean };
  hardwareDefects: string[];
  softwareDefects: string[];

  batteryHealth?: number | null;
  batteryQuality?: string | null;
  isApple: boolean;

  quotedPrice: number;
}

// ──────────────────────────────────────────────
// HTML Email Template
// ──────────────────────────────────────────────

export function buildConfirmationEmail(data: SellConfirmationEmailData): { html: string; text: string } {
  const {
    leadId, customerName, customerPhone, customerAltPhone, customerAddress,
    brandName, modelName, variantName, city, deviceAge, mobileTurnsOn,
    accessories, hardwareDefects, softwareDefects,
    batteryHealth, batteryQuality, isApple, quotedPrice,
  } = data;

  const yesNo = (v: boolean) => v
    ? `<span style="color:#16a34a;font-weight:600;">✔ Yes</span>`
    : `<span style="color:#dc2626;font-weight:600;">✘ No</span>`;

  const batteryRow = isApple
    ? `<tr><td style="${tdStyle}color:#6b7280;">Battery Health</td><td style="${tdStyle}font-weight:600;">${batteryHealth ?? "N/A"}%</td></tr>`
    : `<tr><td style="${tdStyle}color:#6b7280;">Battery Condition</td><td style="${tdStyle}font-weight:600;">${batteryQuality ?? "N/A"}</td></tr>`;

  const hwList = hardwareDefects.length
    ? hardwareDefects.map(d => `<li>${HARDWARE_LABELS[d] ?? d}</li>`).join("")
    : "<li style='color:#6b7280;'>None reported</li>";

  const swList = softwareDefects.length
    ? softwareDefects.map(d => `<li>${SOFTWARE_LABELS[d] ?? d}</li>`).join("")
    : "<li style='color:#6b7280;'>None reported</li>";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>TheMobiQ – Sell Request Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f 0%,#0ea5e9 100%);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">TheMobiQ</h1>
            <p style="margin:8px 0 0;color:#bae6fd;font-size:14px;">Sell Request Confirmation</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:36px 40px 0;">
            <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Hi ${customerName} 👋</h2>
            <p style="margin:0;color:#475569;font-size:15px;line-height:1.6;">
              Thank you for choosing <strong>TheMobiQ</strong>! Your sell request has been received successfully.
              Our team will contact you within <strong>24 hours</strong> to schedule your free doorstep pickup.
            </p>
            <p style="margin:12px 0 0;color:#475569;font-size:13px;">Reference ID: <code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;font-family:monospace;font-weight:600;">${leadId}</code></p>
          </td>
        </tr>

        <!-- Warning Banner -->
        <tr>
          <td style="padding:20px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;font-size:13px;color:#92400e;font-weight:700;margin-bottom:6px;">⚠️  Important Price Disclaimer</p>
                  <p style="margin:0;font-size:13px;color:#78350f;line-height:1.6;">
                    The quoted price of <strong>₹${quotedPrice.toLocaleString("en-IN")}</strong> is based on the information you provided.
                    If our technician finds any <strong>unreported defects, inaccurate condition details, or missing accessories</strong>
                    during the physical inspection, <strong>the final offer price may be revised downward</strong>.
                    Please ensure all details are accurate to avoid any difference at the time of pickup.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Quoted Price Highlight -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #10b981;border-radius:12px;">
              <tr>
                <td style="padding:24px;text-align:center;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#059669;letter-spacing:1.5px;text-transform:uppercase;">TheMobiQ Quoted Price</p>
                  <p style="margin:0;font-size:44px;font-weight:900;color:#0f172a;">₹${quotedPrice.toLocaleString("en-IN")}</p>
                  <p style="margin:6px 0 0;font-size:12px;color:#6b7280;">Valid for 3 days · Doorstep pickup available</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Section heading -->
        <tr><td style="padding:0 40px 12px;"><p style="margin:0;font-size:16px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">📱 Device Details</p></td></tr>

        <!-- Device Table -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
              ${row("Brand", brandName)}
              ${row("Model", modelName)}
              ${row("Variant", variantName)}
              ${row("City", city)}
              ${row("Device Age", AGE_LABELS[deviceAge] ?? deviceAge)}
              ${row("Turns On", mobileTurnsOn ? "Yes" : "No")}
              ${batteryRow}
            </table>
          </td>
        </tr>

        <!-- Accessories -->
        <tr><td style="padding:0 40px 12px;"><p style="margin:0;font-size:16px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">🎁 Accessories</p></td></tr>
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
              <tr><td style="${tdStyle}color:#6b7280;">Original Box</td><td style="${tdStyle}">${yesNo(accessories.box)}</td></tr>
              <tr style="background:#f8fafc;"><td style="${tdStyle}color:#6b7280;">Original Charger</td><td style="${tdStyle}">${yesNo(accessories.charger)}</td></tr>
              <tr><td style="${tdStyle}color:#6b7280;">Original Invoice</td><td style="${tdStyle}">${yesNo(accessories.invoice)}</td></tr>
              <tr style="background:#f8fafc;"><td style="${tdStyle}color:#6b7280;">Under Warranty</td><td style="${tdStyle}">${yesNo(accessories.warranty)}</td></tr>
            </table>
          </td>
        </tr>

        <!-- Defects -->
        ${hardwareDefects.length > 0 || softwareDefects.length > 0 ? `
        <tr><td style="padding:0 40px 12px;"><p style="margin:0;font-size:16px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">🔧 Reported Issues</p></td></tr>
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
              <tr>
                <td style="padding:14px 16px;vertical-align:top;width:50%;border-right:1px solid #e2e8f0;">
                  <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Hardware</p>
                  <ul style="margin:0;padding-left:18px;color:#374151;font-size:13px;line-height:1.8;">${hwList}</ul>
                </td>
                <td style="padding:14px 16px;vertical-align:top;">
                  <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Software</p>
                  <ul style="margin:0;padding-left:18px;color:#374151;font-size:13px;line-height:1.8;">${swList}</ul>
                </td>
              </tr>
            </table>
          </td>
        </tr>` : ""}

        <!-- Customer Details -->
        <tr><td style="padding:0 40px 12px;"><p style="margin:0;font-size:16px;font-weight:700;color:#0f172a;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">👤 Your Details</p></td></tr>
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
              ${row("Phone", customerPhone)}
              ${customerAltPhone ? `<tr style="background:#f8fafc;"><td style="${tdStyle}color:#6b7280;">Alt. Phone</td><td style="${tdStyle}font-weight:600;">${customerAltPhone}</td></tr>` : ""}
              ${row("Pickup Address", customerAddress)}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Need help? Contact us at <a href="mailto:info@themobbiq.com" style="color:#0ea5e9;text-decoration:none;">info@themobbiq.com</a> or call <a href="tel:+919593299593" style="color:#0ea5e9;text-decoration:none;">+91 95932 99593</a></p>
            <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} TheMobiQ. J.P Nagar, Phase 1, Bengaluru 560078.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // Plain-text fallback
  const text = `
TheMobiQ – Sell Request Confirmation
Reference ID: ${leadId}

Hi ${customerName},

Your sell request for ${modelName} (${variantName}) has been received!

⚠ IMPORTANT: The quoted price of ₹${quotedPrice.toLocaleString("en-IN")} is based on the details you provided.
If unreported defects or inaccurate condition details are found during inspection, the final price may be revised.

--- QUOTED PRICE ---
₹${quotedPrice.toLocaleString("en-IN")} (valid 3 days)

--- DEVICE DETAILS ---
Brand:      ${brandName}
Model:      ${modelName}
Variant:    ${variantName}
City:       ${city}
Device Age: ${AGE_LABELS[deviceAge] ?? deviceAge}
Turns On:   ${mobileTurnsOn ? "Yes" : "No"}

--- ACCESSORIES ---
Original Box:     ${accessories.box ? "Yes" : "No"}
Original Charger: ${accessories.charger ? "Yes" : "No"}
Original Invoice: ${accessories.invoice ? "Yes" : "No"}
Under Warranty:   ${accessories.warranty ? "Yes" : "No"}

--- YOUR DETAILS ---
Phone:   ${customerPhone}
Address: ${customerAddress}

Our team will contact you within 24 hours.
For queries: info@themobbiq.com | +91 95932 99593
`;

  return { html, text };
}

// ──────────────────────────────────────────────
// Utility: table row helpers
// ──────────────────────────────────────────────

const tdStyle = "padding:12px 16px;font-size:13px;";

function row(label: string, value: string, even = false) {
  const bg = even ? "background:#f8fafc;" : "";
  return `<tr style="${bg}"><td style="${tdStyle}color:#6b7280;">${label}</td><td style="${tdStyle}font-weight:600;color:#0f172a;">${value}</td></tr>`;
}

// ──────────────────────────────────────────────
// Main send function
// ──────────────────────────────────────────────

export async function sendSellConfirmationEmail(data: SellConfirmationEmailData) {
  const transporter = createTransporter();
  const { html, text } = buildConfirmationEmail(data);

  const fromName = process.env.SMTP_FROM_NAME ?? "TheMobiQ";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER!;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: data.customerEmail,
    subject: `✅ TheMobiQ – Your sell request for ${data.modelName} is confirmed!`,
    html,
    text,
  });
}

// ──────────────────────────────────────────────
// Pickup Scheduled Email
// ──────────────────────────────────────────────

export async function sendPickupEmail(params: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  modelName: string;
  variantName: string;
  leadId: string;
  quotedPrice: number;
  city: string;
}) {
  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME ?? "TheMobiQ";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER!;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>TheMobiQ – Pickup Scheduled</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f 0%,#0ea5e9 100%);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">TheMobiQ</h1>
            <p style="margin:8px 0 0;color:#bae6fd;font-size:14px;">Pickup Confirmation</p>
          </td>
        </tr>

        <!-- Icon Banner -->
        <tr>
          <td style="background:#f0fdf4;padding:28px 40px;text-align:center;border-bottom:2px solid #bbf7d0;">
            <p style="font-size:48px;margin:0;">🛵</p>
            <h2 style="margin:12px 0 4px;color:#15803d;font-size:22px;font-weight:800;">We're on our way!</h2>
            <p style="margin:0;color:#166534;font-size:14px;">Our executive is heading to your location. Please be available.</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px 0;">
            <h2 style="margin:0 0 12px;font-size:20px;color:#0f172a;">Hi ${params.customerName} 👋</h2>
            <p style="margin:0;color:#475569;font-size:15px;line-height:1.7;">
              Great news! The <strong>TheMobiQ team is coming</strong> to pick up your 
              <strong>${params.modelName} (${params.variantName})</strong>.<br/>
              Please ensure yourself or a responsible person is available at the pickup address.
            </p>
          </td>
        </tr>

        <!-- Pickup Details -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
              <tr><td style="padding:14px 18px;color:#6b7280;font-size:13px;">Reference ID</td><td style="padding:14px 18px;font-weight:700;font-size:13px;color:#0f172a;font-family:monospace;">${params.leadId}</td></tr>
              <tr style="background:#f1f5f9;"><td style="padding:14px 18px;color:#6b7280;font-size:13px;">Device</td><td style="padding:14px 18px;font-weight:700;font-size:13px;color:#0f172a;">${params.modelName} · ${params.variantName}</td></tr>
              <tr><td style="padding:14px 18px;color:#6b7280;font-size:13px;">Agreed Price</td><td style="padding:14px 18px;font-weight:800;font-size:15px;color:#16a34a;">₹${params.quotedPrice.toLocaleString("en-IN")}</td></tr>
              <tr style="background:#f1f5f9;"><td style="padding:14px 18px;color:#6b7280;font-size:13px;">Pickup Address</td><td style="padding:14px 18px;font-weight:600;font-size:13px;color:#0f172a;">${params.customerAddress}, ${params.city}</td></tr>
              <tr><td style="padding:14px 18px;color:#6b7280;font-size:13px;">Phone</td><td style="padding:14px 18px;font-weight:600;font-size:13px;color:#0f172a;">${params.customerPhone}</td></tr>
            </table>
          </td>
        </tr>

        <!-- Reminder -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0;font-size:13px;color:#c2410c;font-weight:700;margin-bottom:6px;">⚠️  Please Keep in Mind</p>
                <ul style="margin:0;padding-left:18px;color:#9a3412;font-size:13px;line-height:1.8;">
                  <li>Keep your phone accessible — our executive may call before arriving.</li>
                  <li>Have your device ready along with all the accessories you mentioned.</li>
                  <li>Ensure the device condition matches the details you submitted. Any discrepancy may affect the final price.</li>
                </ul>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Questions? Reach us at <a href="mailto:info@themobbiq.com" style="color:#0ea5e9;text-decoration:none;">info@themobbiq.com</a> or <a href="tel:+919593299593" style="color:#0ea5e9;text-decoration:none;">+91 95932 99593</a></p>
            <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} TheMobiQ. J.P Nagar, Phase 1, Bengaluru 560078.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
TheMobiQ – Pickup Scheduled
Hi ${params.customerName},

Our team is coming to pick up your ${params.modelName} (${params.variantName}).
Please be available at: ${params.customerAddress}, ${params.city}

Agreed Price: ₹${params.quotedPrice.toLocaleString("en-IN")}
Reference ID: ${params.leadId}

Keep your device and all accessories ready. 
Our executive may call before arriving — please keep your phone (${params.customerPhone}) accessible.

For queries: info@themobbiq.com | +91 95932 99593
`;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: params.customerEmail,
    subject: `🛵 TheMobiQ – Our team is coming to pick up your ${params.modelName}!`,
    html,
    text,
  });
}

// ──────────────────────────────────────────────
// Order Completed Email
// ──────────────────────────────────────────────

export async function sendCompletedEmail(params: {
  customerName: string;
  customerEmail: string;
  modelName: string;
  variantName: string;
  leadId: string;
  quotedPrice: number;
}) {
  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME ?? "TheMobiQ";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER!;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>TheMobiQ – Order Completed</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f 0%,#0ea5e9 100%);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">TheMobiQ</h1>
            <p style="margin:8px 0 0;color:#bae6fd;font-size:14px;">Transaction Completed</p>
          </td>
        </tr>

        <!-- Success Banner -->
        <tr>
          <td style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:32px 40px;text-align:center;border-bottom:2px solid #6ee7b7;">
            <p style="font-size:56px;margin:0;">🎉</p>
            <h2 style="margin:14px 0 6px;color:#065f46;font-size:24px;font-weight:900;">Thank You!</h2>
            <p style="margin:0;color:#047857;font-size:15px;font-weight:500;">Your order has been successfully completed.</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 0;">
            <h2 style="margin:0 0 12px;font-size:20px;color:#0f172a;">Hi ${params.customerName} ✨</h2>
            <p style="margin:0;color:#475569;font-size:15px;line-height:1.7;">
              We have successfully completed the purchase of your 
              <strong>${params.modelName} (${params.variantName})</strong>. 
              The agreed amount has been processed and the transaction is now finalized.
            </p>
            <p style="margin:16px 0 0;color:#475569;font-size:15px;line-height:1.7;">
              Thank you for choosing <strong>TheMobiQ</strong> — India's trusted platform for selling pre-owned devices. 
              We hope to serve you again! 💙
            </p>
          </td>
        </tr>

        <!-- Summary Box -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #86efac;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#15803d;letter-spacing:1.5px;text-transform:uppercase;">Amount Received</p>
                  <p style="margin:0;font-size:44px;font-weight:900;color:#0f172a;">₹${params.quotedPrice.toLocaleString("en-IN")}</p>
                  <p style="margin:8px 0 0;font-size:13px;color:#6b7280;">Reference: <code style="background:#dcfce7;padding:2px 8px;border-radius:4px;font-weight:700;font-family:monospace;">${params.leadId}</code></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA: Share/Refer -->
        <tr>
          <td style="padding:0 40px 24px;text-align:center;">
            <p style="margin:0 0 12px;color:#475569;font-size:14px;">Got more devices to sell? We'd love to help!</p>
            <a href="https://themobbiq.com/sell" style="display:inline-block;background:linear-gradient(135deg,#1e3a5f,#0ea5e9);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:50px;font-weight:700;font-size:14px;">Sell Another Device →</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Questions? <a href="mailto:info@themobbiq.com" style="color:#0ea5e9;text-decoration:none;">info@themobbiq.com</a> · <a href="tel:+919593299593" style="color:#0ea5e9;text-decoration:none;">+91 95932 99593</a></p>
            <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} TheMobiQ. J.P Nagar, Phase 1, Bengaluru 560078.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
TheMobiQ – Order Completed 🎉
Hi ${params.customerName},

Your order for ${params.modelName} (${params.variantName}) has been successfully completed.
Amount Received: ₹${params.quotedPrice.toLocaleString("en-IN")}
Reference ID: ${params.leadId}

Thank you for choosing TheMobiQ! We hope to serve you again.


For queries: info@themobbiq.com | +91 95932 99593
`;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: params.customerEmail,
    subject: `🎉 TheMobiQ – Your order is completed. Thank you, ${params.customerName}!`,
    html,
    text,
  });
}
