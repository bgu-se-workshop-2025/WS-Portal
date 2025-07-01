import { MessageDto } from "../../../shared/types/dtos.ts";
import { SDK } from "../../sdk.ts";

const storeController = "stores";

export async function getStoreRequests(this: SDK, storeId: string, page: number = 0, size: number = 25): Promise<MessageDto[]> {
    const response = await this.get(`${storeController}/${storeId}/requests`, { page: page.toString(), size: size.toString() });
    
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Get store requests failed: ${err}`);
    }
    
    return await response.json() as MessageDto[];
}

export async function getStoreResponses(this: SDK, storeId: string, page: number = 0, size: number = 25): Promise<MessageDto[]> {
    const response = await this.get(`${storeController}/${storeId}/responses`, { page: page.toString(), size: size.toString() });
    
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Get store responses failed: ${err}`);
    }
    
    return await response.json() as MessageDto[];
}

export async function respondToStoreRequest(this: SDK, storeId: string, messageId: string, response: MessageDto): Promise<MessageDto> {
    const apiResponse = await this.post(`${storeController}/${storeId}/requests/${messageId}/response`, response);
    
    if (!apiResponse.ok) {
        const err = await apiResponse.text();
        throw new Error(`Respond to store request failed: ${err}`);
    }
    
    return await apiResponse.json() as MessageDto;
}

export async function updateStoreResponse(this: SDK, storeId: string, responseId: string, response: MessageDto): Promise<MessageDto> {
    const apiResponse = await this.patch(`${storeController}/${storeId}/responses/${responseId}`, response);
    
    if (!apiResponse.ok) {
        const err = await apiResponse.text();
        throw new Error(`Update store response failed: ${err}`);
    }
    
    return await apiResponse.json() as MessageDto;
}

export async function deleteStoreResponse(this: SDK, storeId: string, responseId: string): Promise<void> {
    const response = await this.delete(`${storeController}/${storeId}/responses/${responseId}`);
    
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Delete store response failed: ${err}`);
    }
} 