import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

dotenv.config({ path: ".env" })

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/', authRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});



app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});