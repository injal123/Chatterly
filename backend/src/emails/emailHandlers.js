
import { Resend } from 'resend';
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";
import { ENV } from '../lib/env.js';


const resend = new Resend(ENV.RESEND_API_KEY);

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resend.emails.send({
    from: `${ENV.EMAIL_FROM_NAME}<${ENV.EMAIL_FROM}>`,
    to: email,
    subject: "Welcome to Chatterly!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
};