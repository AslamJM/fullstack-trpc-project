import nodemailer from "nodemailer";
import { MAILER_HOST, MAILER_PASS, MAILER_PORT, MAILER_USER } from "../config";

const nodeMailerConfig = {
  host: MAILER_HOST,
  port: MAILER_PORT as number,
  secure: (MAILER_PORT as number) === 465,
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS,
  },
};

export const transporter = nodemailer.createTransport(nodeMailerConfig);
