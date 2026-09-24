
import "./polyfill.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import atsRoutes from "./routes/atsRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow both localhost and Vercel URLs
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://job-portal-frontend-mu.vercel.app' // Production URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // If there's no origin (like curl or postman requests), allow it
    if (!origin) return callback(null, true);
    
    // Allow only allowed origins
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  credentials: true // To allow cookies or other credentials
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// api routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use('/api/contact', contactRoutes);

app.use('/api', atsRoutes);  // This will prefix all ATS routes with /api


// start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});

