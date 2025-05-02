import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

let smptUser = process.env.SMTP_USERNAME;
let smptPassword = process.env.SMTP_PASSWORD;


const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: smptUser,
    pass: smptPassword,
  },
});

app.post("/receive-email", (req, res) => {
  const { name, email, subject, message, phoneNumber } = req.body;
  const senderName = name;
  const senderEmail = email;
  const mailOptions = {
    from: `"${name} ${email}" <${smptUser}>`, // Must match authenticated email
    replyTo: `${senderName} <${senderEmail}>`, // Optional: allows recipients to reply directly to the sender
    to: "gasomba@solarclassng.com",
    subject: subject,
    text: `
    Name: ${senderName}
    Email: ${senderEmail}
    Subject: ${subject}
${phoneNumber ? `Phone Number: ${phoneNumber}` : ""}
      ${message}
      `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(res);
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("sent");
    }
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
