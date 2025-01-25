import express from "express";
import morgan from "morgan";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routers/users.js";
import { authenticateUser } from "./middleware/authentication.js";
import nodemailer from "nodemailer";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

if (!process.env.MONGODBURI || !process.env.GMAIL_EMAIL || !process.env.GMAIL_PASSWORD) {
  console.error("Error: Missing required environment variables.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/", (req, res) => res.send("Server is running"));

app.use("/user", userRoutes);

app.get("/sendEmail", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: '"Muhammad Issa 👻" <issabaloach03@gmail.com>', // sender address
      to: '"Issa Khan" <guddubaloach@gmail.com>', // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    res.send("Message sent: " + info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

app.listen(PORT, () => console.log("Server is running on PORT " + PORT));
