import { EventEmitter } from "node:events";
import nodeMailer from "nodemailer";

export const emitter = new EventEmitter();

interface IEmailArguments {
  to: string;
  subject: string;
  content: string;
  cc?: string;
  attachments?: [];
}

const sendEmail = async ({
  to,
  subject,
  content,
  cc,
  attachments,
}: IEmailArguments) => {
  const transport = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTHOR_EMAIL,
      pass: process.env.AUTHOR_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transport.sendMail({
    from: process.env.AUTHOR_EMAIL,
    to,
    subject,
    html: content,
    cc,
    attachments,
  });
};

emitter.on("sendEmail", (arg) => {
  sendEmail(arg);
});
