import amqp from "amqplib";

let channel: amqp.Channel | null = null;

const EMAIL_NOTIFICATIONS_EXCHANGE = "email_notifications";

export const connectRabbitMQ = async () => {
  try {
    const connectionString = process.env.RABBITMQ_URL || "amqp://localhost:5672";
    const connection = await amqp.connect(connectionString);
    channel = await connection.createChannel();

    await channel.assertExchange(EMAIL_NOTIFICATIONS_EXCHANGE, "topic", {
      durable: true,
    });

    console.log(
      "Auth service connected to RabbitMQ and email_notifications exchange asserted"
    );
  } catch (error) {
    console.error("Auth service RabbitMQ connection error:", error);
    process.exit(1); 
  }
};

export const getChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel not initialized. Call connectRabbitMQ() first."
    );
  }
  return channel;
};

export { EMAIL_NOTIFICATIONS_EXCHANGE };