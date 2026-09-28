import express from 'express';
import { sendContactEmail } from '../utils/emailService.js';
import { contactLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/submit', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Sanitize inputs (prevent XSS)
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().slice(0, 100);
    const sanitizedMessage = message.trim().slice(0, 1000);

    // Send email
    const emailResult = await sendContactEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage
    });

    if (emailResult.success) {
      res.status(200).json(emailResult);
    } else {
      res.status(500).json(emailResult);
    }
  } catch (error) {
    console.error('Contact form server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error processing contact form'
    });
  }
});

export default router;