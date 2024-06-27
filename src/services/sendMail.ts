import nodemailer from "nodemailer";
import { config } from "../config/config.js";

export const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'gaetano.collier@ethereal.email',
      pass: 'K7HsCDJwQJfwrDCy7y'
  }
});

export const sendMail = async (to: string, subject: string, text: string) => {
    try {
        const from = config.getEnv("NODEMAILER_USER");
        if (!from || !to || !subject || !text) throw new Error("Please Provide To, Subject and Text");
        const myTransPorter = transporter;
        await myTransPorter.sendMail({ from, to, subject, text});
        return true;
    } catch (error) {
        return false;
    }
};