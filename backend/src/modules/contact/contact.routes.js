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

router.post('/', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    const { EMAIL_USER, EMAIL_PASS } = process.env;
    if (EMAIL_USER && EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: EMAIL_USER,
        subject: `PushkarOS Portfolio: New Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email
      };

      await transporter.sendMail(mailOptions);
      res.status(201).json({ message: 'Message stored and email sent successfully!' });
    } else {
      console.warn('SMTP credentials missing. Stored message in database but did not email.');
      res.status(201).json({ message: 'Message received and saved in database.' });
    }
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ message: 'Failed to process message' });
  }
});

export default router;
