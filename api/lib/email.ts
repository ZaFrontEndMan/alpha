import nodemailer from 'nodemailer';

export interface SubscriptionIntakeData {
  name: string;
  email: string;
  phone: string;
  selectedTier?: string;
  targetGoal?: string;
  gender?: string;
  age?: string;
  location?: string;
  height?: string;
  weight?: string;
  bodyFat?: string;
  sleepHours?: string;
  sleepQuality?: string;
  dailyActivity?: string;
  trainingDays?: string;
  benchPressMax?: string;
  squatsMax?: string;
  barbellRowsMax?: string;
  medicalConditions?: string;
  onlineCoachingExp?: string;
  cardioMachines?: string[];
  reachSource?: string;
  subscriptionReason?: string;
  proteins?: string[];
  carbs?: string[];
  fruits?: string[];
  veggies?: string[];
  healthyFats?: string[];
  customNotes?: string;
}

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Creates and configures the Nodemailer SMTP transporter.
 * Uses secure SSL on port 465 by default (or 587 with TLS).
 */
export function getEmailTransporter() {
  const host = process.env.SMTP_HOST || 'mail5017.site4now.net';
  const port = Number(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER || 'info@drahmedassem.com';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || '';
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!pass) {
    console.warn('[email] Warning: SMTP_PASS is not configured in environment variables.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Sends a generic email to any recipient.
 */
export async function sendEmail({ to, subject, html, text, replyTo }: SendMailOptions) {
  const transporter = getEmailTransporter();
  const from = process.env.EMAIL_FROM || '"Dr. Ahmed Assem" <info@drahmedassem.com>';

  const mailOptions = {
    from,
    to,
    replyTo: replyTo || process.env.SMTP_USER || 'info@drahmedassem.com',
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * Helper to build high-end customer welcome email HTML.
 */
function buildCustomerWelcomeHtml(data: SubscriptionIntakeData): string {
  const customerName = data.name || 'Valued Client';
  const tier = data.selectedTier || 'Custom Transformation Protocol';
  const goal = data.targetGoal || 'Body Transformation';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Dr. Ahmed Assem Coaching</title>
  <style>
    body { margin: 0; padding: 0; background-color: #090b0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e5e5; }
    .wrapper { max-width: 620px; margin: 0 auto; background-color: #0c0f0d; border: 1px solid #1f2723; border-radius: 8px; overflow: hidden; }
    .header { padding: 36px 32px 24px; text-align: center; background: radial-gradient(circle at top, #15221b 0%, #0c0f0d 100%); border-bottom: 1px solid #1f2723; }
    .brand-title { color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin: 0; text-transform: uppercase; }
    .brand-badge { display: inline-block; margin-top: 8px; padding: 4px 12px; font-size: 11px; font-weight: 700; color: #8cffdb; background: rgba(140, 255, 219, 0.1); border: 1px solid rgba(140, 255, 219, 0.3); border-radius: 4px; letter-spacing: 1.5px; text-transform: uppercase; }
    .content { padding: 32px; font-size: 15px; line-height: 1.6; color: #d4d4d4; }
    .highlight-card { background: #121815; border-left: 3px solid #8cffdb; padding: 18px 20px; margin: 24px 0; border-radius: 0 6px 6px 0; }
    .field-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1a221e; font-size: 14px; }
    .field-label { color: #888888; }
    .field-value { color: #ffffff; font-weight: 600; text-align: right; }
    .steps-list { margin: 20px 0; padding-left: 0; list-style: none; }
    .step-item { display: flex; margin-bottom: 14px; align-items: flex-start; }
    .step-num { width: 24px; height: 24px; border-radius: 50%; background: #8cffdb; color: #000; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; margin-top: 2px; }
    .button { display: inline-block; background-color: #8cffdb; color: #000000; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; margin-top: 16px; text-align: center; }
    .footer { padding: 24px 32px; background-color: #070908; border-top: 1px solid #1a221e; text-align: center; font-size: 12px; color: #737373; }
    .footer a { color: #8cffdb; text-decoration: none; }
  </style>
</head>
<body>
  <div style="padding: 24px 12px;">
    <div class="wrapper">
      <div class="header">
        <h1 class="brand-title">DR. AHMED ASSEM</h1>
        <div class="brand-badge">Intake Received · Protocol Initiated</div>
      </div>

      <div class="content">
        <p style="font-size: 18px; color: #ffffff; font-weight: 700; margin-top: 0;">
          Welcome, ${customerName}!
        </p>
        <p>
          Thank you for taking the decisive step towards your transformation. Your comprehensive intake application has been received and logged directly into Dr. Ahmed Assem's medical coaching portal.
        </p>

        <div class="highlight-card">
          <div class="field-row">
            <span class="field-label">Selected Tier:</span>
            <span class="field-value">${tier}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Primary Target Goal:</span>
            <span class="field-value" style="color: #8cffdb;">${goal}</span>
          </div>
          <div class="field-row" style="border-bottom: none;">
            <span class="field-label">Intake Status:</span>
            <span class="field-value" style="color: #8cffdb;">In Physician Review</span>
          </div>
        </div>

        <h3 style="color: #ffffff; font-size: 16px; margin: 24px 0 12px;">What Happens Next</h3>
        <div class="steps-list">
          <div class="step-item">
            <div class="step-num">1</div>
            <div><strong>Clinical Review:</strong> Dr. Ahmed Assem personally reviews your biometrics, medical history, and nutrition preferences within 24 hours.</div>
          </div>
          <div class="step-item">
            <div class="step-num">2</div>
            <div><strong>Direct Contact:</strong> Our desk will connect with you via WhatsApp (${data.phone || 'your phone'}) to confirm onboarding details and schedule check-ins.</div>
          </div>
          <div class="step-item">
            <div class="step-num">3</div>
            <div><strong>Custom Protocol:</strong> You will receive your fully personalized nutritional and workout protocol built strictly on evidence-based physiology.</div>
          </div>
        </div>

        <p style="margin-top: 28px; text-align: center;">
          <a href="https://drahmedassem.com" class="button">Visit Portal</a>
        </p>
      </div>

      <div class="footer">
        <p style="margin: 0 0 8px 0;">Official Coaching Platform of Dr. Ahmed Assem · IFBB Pro & Clinical Nutritionist</p>
        <p style="margin: 0;">Inquiries: <a href="mailto:info@drahmedassem.com">info@drahmedassem.com</a> · Website: <a href="https://drahmedassem.com">drahmedassem.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Helper to build detailed owner notification email HTML.
 */
function buildOwnerNotificationHtml(data: SubscriptionIntakeData): string {
  const dateStr = new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }) + ' (Cairo)';
  const renderRow = (label: string, val: any) => {
    if (!val || (Array.isArray(val) && val.length === 0)) return '';
    const displayVal = Array.isArray(val) ? val.join(', ') : String(val);
    return `
      <tr>
        <td style="padding: 9px 12px; border-bottom: 1px solid #232b26; color: #9ca3af; font-size: 13px; width: 35%;">${label}</td>
        <td style="padding: 9px 12px; border-bottom: 1px solid #232b26; color: #ffffff; font-size: 13px; font-weight: 600;">${displayVal}</td>
      </tr>
    `;
  };

  const cleanPhone = (data.phone || '').replace(/[^0-9]/g, '');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Client Subscription Notification</title>
</head>
<body style="margin:0; padding:20px; background:#080a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <div style="max-width: 680px; margin: 0 auto; background: #0f1411; border: 1px solid #232b26; border-radius: 8px; overflow: hidden;">
    <div style="padding: 24px; background: #131c17; border-bottom: 2px solid #8cffdb;">
      <div style="color: #8cffdb; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">New Client Alert</div>
      <h2 style="margin: 6px 0 0; color: #ffffff; font-size: 22px;">${data.name || 'Anonymous Client'} Subscribed</h2>
      <div style="color: #9ca3af; font-size: 12px; margin-top: 4px;">Received: ${dateStr}</div>
    </div>

    <div style="padding: 24px;">
      <div style="margin-bottom: 24px; display: flex; gap: 12px;">
        <a href="mailto:${data.email}" style="display:inline-block; padding: 10px 18px; background: #1b2620; border: 1px solid #8cffdb; color: #8cffdb; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 4px;">
          ✉ Email Client (${data.email})
        </a>
        ${cleanPhone ? `
        <a href="https://wa.me/${cleanPhone}" target="_blank" style="display:inline-block; padding: 10px 18px; background: #8cffdb; color: #000000; text-decoration: none; font-size: 12px; font-weight: 800; border-radius: 4px; margin-left: 10px;">
          💬 WhatsApp Client
        </a>` : ''}
      </div>

      <h3 style="color: #8cffdb; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #232b26; padding-bottom: 6px;">Client Profile & Package</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tbody>
          ${renderRow('Full Name', data.name)}
          ${renderRow('Email Address', data.email)}
          ${renderRow('Phone / WhatsApp', data.phone)}
          ${renderRow('Package / Tier', data.selectedTier)}
          ${renderRow('Target Goal', data.targetGoal)}
          ${renderRow('Gender', data.gender)}
          ${renderRow('Age', data.age)}
          ${renderRow('Country / Location', data.location)}
          ${renderRow('Height', data.height ? `${data.height} cm` : undefined)}
          ${renderRow('Weight', data.weight ? `${data.weight} kg` : undefined)}
          ${renderRow('Body Fat %', data.bodyFat)}
        </tbody>
      </table>

      <h3 style="color: #8cffdb; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #232b26; padding-bottom: 6px;">Lifestyle & Training</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tbody>
          ${renderRow('Daily Activity', data.dailyActivity)}
          ${renderRow('Training Days / Week', data.trainingDays)}
          ${renderRow('Sleep Hours', data.sleepHours)}
          ${renderRow('Sleep Quality', data.sleepQuality)}
          ${renderRow('Bench Press Max', data.benchPressMax)}
          ${renderRow('Squats Max', data.squatsMax)}
          ${renderRow('Barbell Rows Max', data.barbellRowsMax)}
          ${renderRow('Cardio Machines', data.cardioMachines)}
          ${renderRow('Online Coaching Exp.', data.onlineCoachingExp)}
          ${renderRow('Medical Conditions', data.medicalConditions)}
          ${renderRow('How they found you', data.reachSource)}
          ${renderRow('Reason for Subscribing', data.subscriptionReason)}
        </tbody>
      </table>

      ${(data.proteins?.length || data.carbs?.length || data.fruits?.length || data.veggies?.length || data.healthyFats?.length) ? `
      <h3 style="color: #8cffdb; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #232b26; padding-bottom: 6px;">Dietary Preferences</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tbody>
          ${renderRow('Preferred Proteins', data.proteins)}
          ${renderRow('Preferred Carbs', data.carbs)}
          ${renderRow('Preferred Fruits', data.fruits)}
          ${renderRow('Preferred Veggies', data.veggies)}
          ${renderRow('Preferred Healthy Fats', data.healthyFats)}
        </tbody>
      </table>
      ` : ''}

      ${data.customNotes ? `
      <div style="padding: 14px; background: #151c17; border-left: 3px solid #8cffdb; color: #d1d5db; font-size: 13px;">
        <strong>Additional Notes:</strong><br/>${data.customNotes}
      </div>
      ` : ''}
    </div>

    <div style="padding: 16px 24px; background: #090c0a; border-top: 1px solid #232b26; font-size: 12px; color: #6b7280; text-align: center;">
      Automated dispatch from drahmedassem.com intake engine.
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Sends both owner notification and client confirmation emails upon subscription.
 */
export async function sendSubscriptionEmails(intakeData: SubscriptionIntakeData) {
  const ownerEmail = process.env.OWNER_EMAIL || 'postmaster@drahmedassem.com';
  const customerEmail = intakeData.email?.trim();

  const results: { ownerSent?: boolean; customerSent?: boolean; errors: string[] } = {
    errors: [],
  };

  // 1. Send notification to owner
  try {
    const ownerSubject = `🔔 New Subscription: ${intakeData.name || 'New Client'} - ${intakeData.selectedTier || 'Intake'}`;
    const ownerHtml = buildOwnerNotificationHtml(intakeData);
    await sendEmail({
      to: ownerEmail,
      subject: ownerSubject,
      html: ownerHtml,
      replyTo: customerEmail || undefined,
    });
    results.ownerSent = true;
  } catch (err) {
    const msg = `Failed to send email to owner (${ownerEmail}): ${err instanceof Error ? err.message : String(err)}`;
    console.error(msg);
    results.errors.push(msg);
  }

  // 2. Send confirmation to customer (if email provided)
  if (customerEmail) {
    try {
      const customerSubject = 'Welcome to Dr. Ahmed Assem Coaching - Subscription Received';
      const customerHtml = buildCustomerWelcomeHtml(intakeData);
      await sendEmail({
        to: customerEmail,
        subject: customerSubject,
        html: customerHtml,
      });
      results.customerSent = true;
    } catch (err) {
      const msg = `Failed to send confirmation email to customer (${customerEmail}): ${err instanceof Error ? err.message : String(err)}`;
      console.error(msg);
      results.errors.push(msg);
    }
  }

  return results;
}
