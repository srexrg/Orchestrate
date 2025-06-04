import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import eventRoutes from './routes/event.routes';

dotenv.config({ path: ".env" })

const app = express();
const PORT = process.env.PORT || 3002;


app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', eventRoutes);





app.listen(PORT, () => {
  console.log(`Event Service running on port ${PORT}`);
});