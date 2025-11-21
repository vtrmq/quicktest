import nodemailer from "nodemailer"
import { GMAIL_USER, GMAIL_APP_PASS } from '$env/static/private';
import { NAME_APP } from "$lib/utils";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASS
    }
  });
};

export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; error?: string; result?: {} }> => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `${NAME_APP} <${GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '')
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, result };
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};
