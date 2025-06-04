import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Essential middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Service routes with proxy
app.use('/api/auth', proxy(process.env.AUTH_SERVICE_URL || 'http://localhost:3001', {
  proxyReqPathResolver: (req) => req.url.replace('/api/auth', '')
}));

app.use('/api/events', proxy(process.env.EVENT_SERVICE_URL || 'http://localhost:3002', {
  proxyReqPathResolver: (req) => req.url.replace('/api/events', '')
}));

app.use('/api/venues', proxy(process.env.VENUE_SERVICE_URL || 'http://localhost:3003', {
  proxyReqPathResolver: (req) => req.url.replace('/api/venues', '')
}));

app.use('/api/attendees', proxy(process.env.ATTENDEE_SERVICE_URL || 'http://localhost:3004', {
  proxyReqPathResolver: (req) => req.url.replace('/api/attendees', '')
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
}); 