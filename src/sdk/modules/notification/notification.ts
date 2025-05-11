import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';

const url = 'http://localhost:8080/ws';

export const client = new Client({
    webSocketFactory: () => new SockJS(url),
    debug: str => console.log(str)
})

export const connect = (onMessageReceived: (msg: string) => void) => {
    client.onConnect = () => {
        console.log('connected!');

        client.subscribe('/queue/notifications', (message) => {
            onMessageReceived(message.body);
        })
    };
    console.log('here!')
    client.activate();
}
