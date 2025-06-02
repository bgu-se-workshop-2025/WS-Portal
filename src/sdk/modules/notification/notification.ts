import { Client, IMessage } from "@stomp/stompjs";

import { SDK } from "../../sdk";
import { Pageable } from "../../../shared/types/dtos";
import { NotificationPayload } from "../../../shared/types/responses";
import { TokenService } from "../../../shared/utils/token";

const baseurl = "http://localhost:8080/ws";
const userNotificationsChannel = "/queue/notifications";
const allUsersNotificationsChannel = "/topic/notifications";

const controller = "notifications";

export const generateClient = () => {
  return new Client({
    brokerURL: baseurl,
    reconnectDelay: 5_000,
    debug: (msg) => {
      console.debug("STOMP debug:", msg);
    },
    connectHeaders: {
      Authorization: `Bearer ${TokenService.token}`,
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
    console.warn(
      "No username provided, cannot subscribe to user notifications."
    );
    return;
  }

  client.subscribe(
    "/user/" + username + userNotificationsChannel,
    (msg: IMessage) => {
      console.debug("Received user notification:", msg);
      if (msg.body) {
        console.debug("Received user notification:", msg.body);
        const notif = JSON.parse(msg.body) as NotificationPayload;
        setNotifications((prev) => [...prev, notif]);
      }
    }
  );
};

export async function getNotifications(
  this: SDK,
  payload: Pageable
): Promise<NotificationPayload[]> {
  const params: Record<string, any> = {
    page: payload.page,
    size: payload.size,
  };

  const response = await this.get(controller, params);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Get notifications failed: ${err}`);
  }

  const result = (await response.json()) as NotificationPayload[];
  return result;
}
