import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';

const url = 'http://localhost:8080/ws';

export const client = new Client({
    webSocketFactory: () => new SockJS(url)
})

export const connect = (onMessageReceived: (msg: string) => void) => {
    client.onConnect = () => {
        console.log('connected!');

        client.subscribe('/topic/notifications', (message) => {
            onMessageReceived(message.body);
        })
    };
    client.activate();
}
