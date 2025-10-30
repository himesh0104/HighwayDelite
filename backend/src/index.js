import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import experiencesRouter from './routes/experiences.js';
import bookingsRouter from './routes/bookings.js';
import promoRouter from './routes/promo.js';

dotenv.config();

const app = express(); // tiny express app for this assignment
const PORT = process.env.PORT || 4000;

// basic security + logs
// not going crazy here, just adding helmet + morgan so it's not totally bare
app.use(helmet());
app.use(morgan('dev'));

// CORS for frontend (pretty open for now tbh)
// TODO: maybe tighten this up if I deploy for real
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    credentials: true,
  })
);

// json parsing
// I always forget this and then req.body is undefined lol
app.use(express.json());

// health
// quick ping route so I can check if server is alive
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'bookit-backend' });
});

// routes
// grouping routes by resource like a grown up
app.use('/experiences', experiencesRouter);
app.use('/bookings', bookingsRouter);
app.use('/promo', promoRouter);

// 404 fallback
// keeping it simple, just say route not found
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});

// simple error handler (TODO: make nicer later)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Something broke 🤕' });
});

app.listen(PORT, () => {
  console.log(`BookIt backend running on http://localhost:${PORT}`); // looks fine to me
});


