import { Client } from "@stomp/stompjs";

const url: string = 'http://localhost:8080/ws';

const userNotificationsChannel: string = '/queue/notifications';
const allUsersNotificationsChannel: string = '/topic/notifications';

export const client: Client = new Client({
    brokerURL: url,
    debug: str => console.log(str)
});

client.onConnect = _ => {
    client.subscribe(userNotificationsChannel, message => {
        console.log(message);
        // TODO: handle notification
    });
    client.subscribe(allUsersNotificationsChannel, message => {
        console.log(message);
        // TODO: handle notification
    });
};
