import { useEffect, useState } from "react";
import {
  generateClient,
  subscribeToNotifications,
} from "../../sdk/modules/notification/notification";
import { NotificationPayload } from "../../shared/types/responses";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = generateClient();

    client.onConnect = () => {
      setConnected(true);
      subscribeToNotifications(client, setNotifications);
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error:", frame.headers["message"]);
      console.error("Additional details:", frame.body);
    };

    client.activate();

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, []);

  return { connected, notifications };
}
