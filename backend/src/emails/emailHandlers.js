
import { Resend } from 'resend';
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";
import { ENV } from '../lib/env.js';


const resend = new Resend(ENV.RESEND_API_KEY);

export const sendWelcomeEmail = async (email, name, clientURL) => {

  if (!email || !name) throw new Error("Email and name are required to send welcome email");
  if (!clientURL) throw new Error("Client URL is required to send welcome email");


  const { data, error } = await resend.emails.send({
    from: `${ENV.EMAIL_FROM_NAME}<${ENV.EMAIL_FROM}>`,
    to: email,
    subject: "Welcome to Chatterly!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {   // This format of error object has more understandable details.
    console.error("RESEND FULL ERROR:", JSON.stringify(error, null, 2)); // 2-space indentation.
    throw error;
  }


  console.log("Welcome Email sent successfully", data);
};