import { Client } from "@stomp/stompjs";

const baseurl: string = 'http://localhost:8080/ws';

const userNotificationsChannel: string = '/queue/notifications';
const allUsersNotificationsChannel: string = '/topic/notifications';

export const websocket: Client = new Client({
    brokerURL: baseurl
});

export const connectWebSocket = () => websocket.activate();
export const closeWebSocket = () => websocket.deactivate();

websocket.onConnect = _ => {
    websocket.subscribe(userNotificationsChannel, message => {
        console.log(message);
        // TODO: handle notification
    });
    websocket.subscribe(allUsersNotificationsChannel, message => {
        console.log(message);
        // TODO: handle notification
    });
};
