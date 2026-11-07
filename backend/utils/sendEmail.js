
import nodemailer from "nodemailer";

// Configure Gmail SMTP using the application's email account
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send an email to the requested recipient
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Lead management System Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

export default sendEmail;
