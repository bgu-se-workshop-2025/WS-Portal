import { MessageDto } from "../../../shared/types/dtos.ts";
import { SDK } from "../../sdk.ts";

const controller = "message";

export async function createMessage(this: SDK, payload: MessageDto): Promise<MessageDto> {
    const response = await this.post(`${controller}`, payload);
    if (!response.ok) {
         const err = await response.text();
         throw new Error(`Send message failed: ${err}`);
    }
    const result = await response.json() as MessageDto;
    return result;
}

export async function getMessages(this: SDK, page: number = 0, size: number = 25): Promise<MessageDto[]> {
    const query = new URLSearchParams({ page: page.toString(), size: size.toString() });
    const response = await this.get(`${controller}?${query.toString()}`, {});
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Get messages failed: ${err}`);
    }
    return await response.json() as MessageDto[];
}

export async function getSentMessages(this: SDK, page: number = 0, size: number = 25): Promise<MessageDto[]> {
    const query = new URLSearchParams({ page: page.toString(), size: size.toString() });
    const response = await this.get(`${controller}/sent?${query.toString()}`, {});
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Get sent messages failed: ${err}`);
    }
    return await response.json() as MessageDto[];
}

export async function getMessageById(this: SDK, messageId: string): Promise<MessageDto> {
    const response = await this.get(`${controller}/${messageId}`, {});
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Get message by ID failed: ${err}`);
    }
    return await response.json() as MessageDto;
}

export async function updateMessage(this: SDK, messageId: string, payload: MessageDto): Promise<MessageDto> {
    const response = await this.patch(`${controller}/${messageId}`, payload);
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Update message failed: ${err}`);
    }
    return await response.json() as MessageDto;
}

export async function deleteMessage(this: SDK, messageId: string): Promise<void> {
    const response = await this.delete(`${controller}/${messageId}`);
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Delete message failed: ${err}`);
    }
}

