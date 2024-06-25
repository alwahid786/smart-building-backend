import nodemailer from "nodemailer";
import { config } from "../config/config.js";

export const transporter = nodemailer.createTransport({
  host: config.getEnv("NODEMAILER_HOST"),
  port: parseInt(config.getEnv("NODEMAILER_PORT")),
  service: "gmail",
  auth: {
    user: "odell.bauch@ethereal.email",
    pass: "kUqMtq28qADh97uVAm",
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const from = config.getEnv("NODEMAILER_USER");
    if (!from || !to || !subject || !text)
      throw new Error("Please Provide To, Subject and Text");
    const myTransPorter = transporter;
    await myTransPorter.sendMail({
      from,
      to,
      subject,
      text,
    });
    return true;
  } catch (error) {
    return false;
  }
};
