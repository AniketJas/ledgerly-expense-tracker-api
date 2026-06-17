import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { initDB } from './configs/db.js';
import ratelimiter from './middleware/rateLimiter.js';
import cors from 'cors';
import job from './configs/cron.js';

import transactionsRoute from './routes/transactionsRoute.js';
import usersRoute from './routes/usersRoute.js';

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 9009;

//middlewares
app.use(ratelimiter)
app.use(express.json());
app.use(morgan('dev'));

if (process.env.NODE_ENV === 'production') {
  job.start();
}

app.use(cors({
  origin: "*", // or restrict to your frontend later
  methods: ["GET", "POST", "DELETE"],
}));

//routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Ledgerly API' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: 1, status: "OK" });
});

app.use("/api/transactions", transactionsRoute);
app.use("/api/users", usersRoute);


initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
  });
});