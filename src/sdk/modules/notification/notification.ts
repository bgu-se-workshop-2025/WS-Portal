import { Client } from "@stomp/stompjs";

const url = 'http://localhost:8080/ws';

export const client = new Client({
    brokerURL: url,
    debug: str => console.log(str)
});

client.onConnect = frame => {
    console.log('connected: ' + frame);
    client.subscribe('/queue/notifications', (message) => {
        console.log(message);
    })
}
