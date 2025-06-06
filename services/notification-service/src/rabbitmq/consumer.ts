import { getChannel, EMAIL_NOTIFICATIONS_EXCHANGE } from "./connection";

import { emailService } from "../services/email.service"; 

const USER_REGISTERED_QUEUE = "user_registered_email_queue";
const USER_REGISTERED_ROUTING_KEY = "user.registered"; // Must match the routing key used by auth-service

interface UserRegistrationEmailData {
  name: string;
  email: string;
}

export const startUserRegisteredConsumer = async () => {
  const channel = getChannel();

  try {
    await channel.assertQueue(USER_REGISTERED_QUEUE, {
      durable: true, // Make the queue durable so messages are not lost if RabbitMQ restarts
    });


    await channel.bindQueue(
      USER_REGISTERED_QUEUE,
      EMAIL_NOTIFICATIONS_EXCHANGE,
      USER_REGISTERED_ROUTING_KEY
    );

    console.log(
      `Notification service: Waiting for messages in ${USER_REGISTERED_QUEUE}. To exit press CTRL+C`
    );

    channel.consume(
      USER_REGISTERED_QUEUE,
      async (msg) => {
        if (msg !== null) {
          try {
            const messageContent = msg.content.toString();
            const parsedMessage = JSON.parse(messageContent) as { type: string; data: UserRegistrationEmailData };

            if (parsedMessage.type === "USER_REGISTERED") {
              const userData = parsedMessage.data;
              console.log(
                `Notification service: Received USER_REGISTERED event for ${userData.email}`
              );
              
              await emailService.sendWelcomeEmail(userData);
              
              console.log(`Notification service: Welcome email sent to ${userData.email}`);
              channel.ack(msg); 
            } else {
              console.warn(
                `Notification service: Received unknown message type: ${parsedMessage.type}`
              );
              channel.nack(msg, false, false);
            }
          } catch (error) {
            console.error(
              "Notification service: Error processing message:",
              error
            );
            channel.nack(msg, false, false); 
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error(
      "Notification service: Error starting user registered consumer:",
      error
    );
    // Handle errors maybe later
  }
};
