// server.js (updated)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');
const connectDB = require('./db/dbConnect');
const authRouter = require('./router/auth-router');
const pubRouter = require('./router/pub-router');
const globalErrorHandler = require('./middlewares/error-mid');

// Load config
dotenv.config({ path: './config.env' });

// Initialize app
const app = express();

// Database connection
connectDB();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting (100 requests/hour)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Try again in an hour.',
});
app.use('/api', limiter);

// CORS configuration
app.use(
  cors({
    origin: 'https://utkarshgupta.vercel.app',
    methods: 'GET,POST,PUT,DELETE,PATCH,HEAD',
    credentials: true,
  })
);

// Body parser + cookies
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Serve static files (including uploaded publications)
app.use('/assets', express.static(path.join(__dirname, 'client/src/assets')));

// Routes
app.get('/', (req, res) => {
  res.status(200).send('Academic Portfolio API');
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/publications', pubRouter);

// Error handling
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});