import { SDK } from "../../sdk.ts";

const controller = "message";

interface SendMessagePayload {
    recipientId: string;
    title: string;
    body: string;
}

export async function sendMessage(this: SDK, payload: SendMessagePayload): Promise<void> {
    const response = await fetch(
        `${this.getOptions().baseUrl}/${controller}/send`,
        {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        throw new Error(`Send message failed: ${response.statusText}`);
    }

}
