import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 587,
  auth: {
      user: 'development@tetratechnologies.io',
      pass: 'ZIm DE~.r9lD>PF'
  }
});

export const sendMail = async (to: string, subject: string, text: string) => {
    try {
        const from ="development@tetratechnologies.io";
        if (!from || !to || !subject || !text) throw new Error("Please Provide To, Subject and Text");
        const myTransPorter = transporter;
        await myTransPorter.sendMail({ from:`"Tetra Technologies" <${from}>`, to, subject, text});
        return true;
    } catch (error) {
        return false;
    }
};