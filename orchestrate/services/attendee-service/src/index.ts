import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import attendeeRoutes from './routes/attendee.routes';

dotenv.config({ path: ".env" })

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/', attendeeRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});



app.listen(PORT, () => {
  console.log(`Attendee Service running on port ${PORT}`);
});