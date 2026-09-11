require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:", "blob:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "data:", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
}));

// Раздаем статические файлы (index.html, css, img) из текущей директории
app.use(express.static(path.join(__dirname)));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

app.post('/api/contact', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail(),
  body('phone').matches(/^[\d\s\+\-\(\)]{10,20}$/),
  body('inn').matches(/^\d{10}$|^\d{12}$/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Ошибка в данных' });

  const { name, email, phone, inn, comment } = req.body;
  try {
    await transporter.sendMail({
      from: `"АБ Невантис" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Новая заявка от ${name}`,
      html: `<h3>Новая заявка</h3><p><b>ФИО:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Телефон:</b> ${phone}</p><p><b>ИНН:</b> ${inn}</p><p><b>Комментарий:</b> ${comment || 'Нет'}</p>`
    });
    res.json({ success: true, message: 'Заявка отправлена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
