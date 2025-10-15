import nodemailer from 'nodemailer'
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service:"gmail",
  secure:true,
  host: "smtp-relay.brevo.com",
  port: 465, 
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  }, 
});

export default transporter