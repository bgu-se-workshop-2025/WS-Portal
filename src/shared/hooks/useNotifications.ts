// src/hooks/useAuthentications.ts
import { useEffect, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import {
  baseurl,
  userNotificationsChannel,
  allUsersNotificationsChannel,
} from '../../sdk/modules/notification/notification';

export interface NotificationPayload {
  // adjust these fields to whatever your backend sends
  id: string;
  title: string;
  message: string;
  timestamp: number;
}

export function useAuthentications() {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      brokerURL: baseurl,
      reconnectDelay: 5_000,        // retry every 5s if connection drops
    });

    client.onConnect = () => {
      setConnected(true);

      // user-specific notifications
      client.subscribe(userNotificationsChannel, (msg: IMessage) => {
        if (msg.body) {
          const notif = JSON.parse(msg.body) as NotificationPayload;
          setNotifications((prev) => [...prev, notif]);
        }
      });

      // broadcast to all users
      client.subscribe(allUsersNotificationsChannel, (msg: IMessage) => {
        if (msg.body) {
          const notif = JSON.parse(msg.body) as NotificationPayload;
          setNotifications((prev) => [...prev, notif]);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
    };

    client.activate();

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, []); // run once on mount / cleanup on unmount

  return { connected, notifications };
}
