import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import venueRoutes from './routes/venue.routes';

dotenv.config({ path: ".env" })

const app = express();
const PORT = process.env.PORT || 3002;


app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/', venueRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});



app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});