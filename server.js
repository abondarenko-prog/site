require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

// УВЕЛИЧИВАЕМ ЛИМИТ до 10 МБ, чтобы избежать PayloadTooLargeError
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static(path.join(__dirname)));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

app.post('/api/contact', async (req, res) => {
  console.log('📩 ПОЛУЧЕНЫ ДАННЫЕ ФОРМЫ:', req.body);

  const { name, email, phone, inn, comment } = req.body;

  if (!name || !email || !phone) {
    console.log('⚠️ Отклонено: не заполнены обязательные поля');
    return res.status(400).json({ success: false, message: 'Заполните обязательные поля' });
  }

  try {
    await transporter.sendMail({
      from: `"АБ НЕВАНТИС" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Новая заявка от ${name}`,
      html: `
        <h3>Новая заявка с сайта</h3>
        <p><b>ФИО:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Телефон:</b> ${phone}</p>
        <p><b>ИНН:</b> ${inn || 'Не указан'}</p>
        <p><b>Комментарий:</b> ${comment || 'Нет'}</p>
      `
    });
    console.log('✅ ПИСЬМО УСПЕШНО ОТПРАВЛЕНО!');
    res.json({ success: true, message: 'Заявка успешно отправлена' });
  } catch (error) {
    console.error('❌ ОШИБКА ОТПРАВКИ ПИСЬМА:', error.message);
    res.status(500).json({ success: false, message: 'Ошибка сервера: ' + error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
