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
  host: "mail.solarclassng.com",
  port: 587, // or the appropriate port for your mail service
  secure: false, // true for 465, false for other ports
  auth: {
    user: smptUser,
    pass: smptPassword,
  },
});

app.post("/receive-email", (req, res) => {
  console.log(req.body);
  const { name, email, subject, message, phoneNumber } = req.body;
  const senderName = name;
  const senderEmail = email;
  const mailOptions = {
    from: `${senderName} <${senderEmail}>`,
    to: "contact@solarclassng.com",
    subject: subject,
    text: `
    ${message}
    ${phoneNumber ? `Phone Number: ${phoneNumber}` : ''}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("failed");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("sent");
    }
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
