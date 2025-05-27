import { Client, IMessage } from "@stomp/stompjs";
import { NotificationPayload } from "../../../shared/types/responses";

const baseurl = "http://localhost:8080/ws";
const userNotificationsChannel = "/queue/notifications";
const allUsersNotificationsChannel = "/topic/notifications";

export const generateClient = () => {
  return new Client({
    brokerURL: baseurl,
    reconnectDelay: 5_000,
    debug: (msg) => {
      console.debug("STOMP debug:", msg);
    },
  });
};

export const subscribeToNotifications = (
  client: Client,
  username: string | undefined,
  setNotifications: React.Dispatch<React.SetStateAction<NotificationPayload[]>>
) => {
  
  // broadcast to all users
  client.subscribe(allUsersNotificationsChannel, (msg: IMessage) => {
    if (msg.body) {
      console.debug("Received broadcast notification:", msg.body);
      const notif = JSON.parse(msg.body) as NotificationPayload;
      setNotifications((prev) => [...prev, notif]);
    }
  });
  
  // user-specific notifications
  if (!username) {
    console.warn("No username provided, cannot subscribe to user notifications.");
    return;
  }

  client.subscribe("/user/" + username + userNotificationsChannel, (msg: IMessage) => {
    console.debug("Received user notification:", msg);
    if (msg.body) {
      console.debug("Received user notification:", msg.body);
      const notif = JSON.parse(msg.body) as NotificationPayload;
      setNotifications((prev) => [...prev, notif]);
    }
  });
};
