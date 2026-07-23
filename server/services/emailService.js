import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend using your environment variable
// (Falls back to null if missing, so development mode still works with console logs)
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendVerificationEmail = async (toEmail, token) => {
  // In production, APP_URL is the public backend URL (e.g. https://api.mernacademy.com)
  // In development, falls back to localhost:5000
  const backendUrl = process.env.APP_URL || 'http://localhost:5000';
  const verificationLink = `${backendUrl}/api/auth/verify-email?token=${token}`;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 8px;">
      <h2 style="color: #D96B43; text-align: center; border-bottom: 2px solid #D96B43; padding-bottom: 10px;">
        🎓 MERN Academy Verification
      </h2>
      <p style="font-size: 16px; color: #1e293b; line-height: 1.5;">
        Thank you for joining the MERN Mastery Academy. Please verify your email address to unlock your full syllabus and start building certifications.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #D96B43; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size: 14px; color: #64748b;">
        If the button above does not work, copy and paste this URL into your browser:
      </p>
      <p style="font-size: 12px; color: #64748b; background-color: #f1f5f9; padding: 10px; word-break: break-all; border-radius: 4px;">
        ${verificationLink}
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        Sent by MERN Mastery Academy, Developer Platform.
      </p>
    </div>
  `;

  // Use Resend in Production
  if (resend) {
    try {
      const response = await resend.emails.send({
        from: 'onboarding@resend.dev', // Default testing address for Resend free tier
        to: toEmail,
        subject: 'Verify Your MERN Academy Email Address',
        html: htmlContent
      });
      
      if (response.error) {
        console.error("[RESEND API Error]", response.error);
        return false;
      }
      
      console.log(`[RESEND] Verification email dispatched to ${toEmail}. ID: ${response.data?.id}`);
      return true;
    } catch (error) {
      console.error("[RESEND Exception] Failed to send email via Resend SDK:", error);
      return false;
    }
  }

  // Developer/Local Fallback Console logs (if RESEND_API_KEY is missing)
  console.log("==========================================================================");
  console.log("📨 [DEVELOPMENT EMAIL FALLBACK - NO API KEY FOUND]");
  console.log(`To: ${toEmail}`);
  console.log("Verify using this URL:");
  console.log(`👉 ${verificationLink}`);
  console.log("==========================================================================");
  return false;
};
