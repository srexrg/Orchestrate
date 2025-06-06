import { getChannel, EMAIL_NOTIFICATIONS_EXCHANGE } from "./connection";

interface UserRegistrationEmailData {
  name: string;
  email: string;

}


export const publishUserRegisteredEvent = async (
  userData: UserRegistrationEmailData
) => {
  const channel = getChannel();

  // Define the routing key for user registration events
  // This should match the binding key used by the notification-service for the user registration queue
  const routingKey = "user.registered";

  const eventPayload = {
    type: "USER_REGISTERED",
    data: userData,
  };

  try {
    channel.publish(
      EMAIL_NOTIFICATIONS_EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(eventPayload)),
      {
        contentType: "application/json",
        persistent: true, 
      }
    );
    console.log(
      `Auth service published USER_REGISTERED event for ${userData.email} to ${EMAIL_NOTIFICATIONS_EXCHANGE} with routing key ${routingKey}`
    );
  } catch (error) {
    console.error(
      `Auth service failed to publish USER_REGISTERED event for ${userData.email}:`,
      error
    );
    // Handle publishing errors
  }
};