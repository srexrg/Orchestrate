import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectRabbitMQ } from './rabbitmq/connection';
import { startUserRegisteredConsumer } from './rabbitmq/consumer'; 

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 3005;


app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'notification-service',
        timestamp: new Date().toISOString()
    });
});

// Basic info endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Orchestrate Notification Service',
        version: '1.0.0',
        description: 'Email notification service using RabbitMQ',
        endpoints: {
            health: '/health'
        }
    });
});


// Start server and initialize notification service
const startService = async () => {
    try {
        await connectRabbitMQ(); 
        await startUserRegisteredConsumer(); 

        app.listen(PORT, () => {
            console.log(`📧 Notification Service running on port ${PORT}`);
            console.log(`🎧 Listening for email notification requests...`);
        });
    } catch (error) {
        console.error('❌ Failed to start notification service:', error);
        process.exit(1);
    }
};

startService();
