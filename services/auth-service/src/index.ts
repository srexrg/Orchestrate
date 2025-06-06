import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { connectRabbitMQ } from './rabbitmq/connection';

dotenv.config({ path: ".env" })

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())



app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', authRoutes);

app.listen(PORT, async () => {
  console.log(`Auth Service running on port ${PORT}`);
  
  try {
    await connectRabbitMQ();
    console.log('Auth service successfully connected to RabbitMQ.');
  } catch (error) {
    console.warn('⚠️ Auth service: Could not connect to RabbitMQ for email notifications', error);
  }
});