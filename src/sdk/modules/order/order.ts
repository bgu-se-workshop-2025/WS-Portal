import { SDK } from "../../sdk";
import { Pageable } from "../../../shared/types/dtos.ts";

const order = "orders";
const store = "stores";

export interface UserOrderDto {
    id: string;
    time: string;
    buyerId: string;
    // TODO shipping address: string;
    cartSnapshot: string;
}

export interface StoreOrderDto {
    id: string;
    time: string;
    storeId: string;
    storeSnapshot: string;
}

export async function getUserOrders(this: SDK, pageable: Pageable): Promise<UserOrderDto[]> {
    const response = await this.get(`${order}`, pageable);

    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching user orders: ${error}`);
    }

    const result = (await response.json()) as UserOrderDto[];
    return result;
}

export async function getUserOrderById(this: SDK, id: string): Promise<UserOrderDto> {
    const response = await this.get(`${order}/${id}`, {});

    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching order by ID: ${error}`);
    }

    const result = (await response.json()) as UserOrderDto;
    return result;
    
}

export async function getStoreOrderById(this: SDK, orderId: string, storeId: string): Promise<StoreOrderDto> {
    const response = await this.get(`${order}/${orderId}/${store}/${storeId}`, {});

    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching store order by ID: ${error}`);
    }

    const result = (await response.json()) as StoreOrderDto;
    return result;

}

export async function getStoreOrders(this: SDK, storeId: string, pageable: Pageable): Promise<StoreOrderDto[]> {
    const response = await this.get(`${order}/${store}/${storeId}`, pageable);

    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching store orders: ${error}`);
    }

    const result = (await response.json()) as StoreOrderDto[];
    return result;
    
}