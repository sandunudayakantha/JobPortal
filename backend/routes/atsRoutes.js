import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/atsController.js';
import { atsLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  },
});

// Add logging middleware
router.use((req, res, next) => {
  //   console.log(`${req.method} ${req.url}`);
  next();
});

router.post('/analyze-resume',
  atsLimiter,
  (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'File upload error: ' + err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // console.log('Received file:', req.file.originalname);
    next();
  },
  analyzeResume
);

export default router; 