const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===== CORS ===== */
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "https://emresde.github.io", // GitHub Pages origin
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // curl/Postman
    return allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

/* ===== Parsers ===== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== Health ===== */
app.get("/", (req, res) => res.send("Backend çalışıyor"));

/* ===== Helpers ===== */
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || "");

/* ===== Contact ===== */
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Sunucu tarafı validasyon
  const errors = {};
  if (!name || !String(name).trim()) errors.name = "Ad Soyad zorunludur.";
  if (email && !isEmail(email)) errors.email = "Geçerli bir e-posta adresi girin.";
  if (!subject || !String(subject).trim()) errors.subject = "Konu zorunludur.";
  if (!message || !String(message).trim()) errors.message = "Mesaj zorunludur.";

  // (opsiyonel) uzunluk sınırları
  if (name && String(name).length > 80) errors.name = "Ad Soyad 80 karakteri geçemez.";
  if (email && String(email).length > 120) errors.email = "E-posta 120 karakteri geçemez.";
  if (subject && String(subject).length > 120) errors.subject = "Konu 120 karakteri geçemez.";
  if (message && String(message).length > 2000) errors.message = "Mesaj 2000 karakteri geçemez.";

  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, error: "validation_error", errors });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"İletişim Formu" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      subject,
      text:
`Gönderen: ${name}${email ? " <" + email + ">" : ""}
Konu: ${subject}

Mesaj:
${message}
`,
      ...(email ? { replyTo: email } : {}),
    });

    res.json({ ok: true, message: "Mesaj başarıyla gönderildi." });
  } catch (err) {
    console.error("SMTP/Server error:", err);
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Contact backend running: http://localhost:${PORT}`);
});