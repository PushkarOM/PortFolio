import express from 'express';
import nodemailer from 'nodemailer';
import Message from './contact.model.js';

import rateLimit from 'express-rate-limit';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 contact submissions per hour
  message: { message: 'Too many messages sent, please try again after an hour' }
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip CR/LF so user input can't inject extra email headers.
const sanitizeHeaderValue = (value) => String(value).replace(/[\r\n]/g, ' ').trim();

router.post('/', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  // Saving the message is the critical path — it must succeed/fail independently
  // of the email step, so a flaky SMTP call never causes duplicate DB entries.
  let newMessage;
  try {
    newMessage = new Message({ name, email, message });
    await newMessage.save();
  } catch (err) {
    console.error('Contact save error:', err);
    return res.status(500).json({ message: 'Failed to save message' });
  }

  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (EMAIL_USER && EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      });

      const safeName = sanitizeHeaderValue(name);
      const mailOptions = {
        from: `"${safeName}" <${email}>`,
        to: EMAIL_USER,
        subject: `PushkarOS Portfolio: New Message from ${safeName}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email
      };

      await transporter.sendMail(mailOptions);
      return res.status(201).json({ message: 'Message stored and email sent successfully!' });
    } catch (err) {
      // Email is best-effort — the message is already safely saved, so this is not a failure.
      console.error('Contact email send error (message already saved):', err);
      return res.status(201).json({ message: 'Message received and saved in database.' });
    }
  }

  console.warn('SMTP credentials missing. Stored message in database but did not email.');
  res.status(201).json({ message: 'Message received and saved in database.' });
});

export default router;
