import { SDK } from "../../sdk";

const order = "orders";
const store = "stores";

export interface pageable {
    page: number;
    size: number;
}

export interface UserOrderDto {
    id: string;
    // TODO time: LocalDateTime;
    buyerId: string;
    // TODO shipping address: string;
    cartSnapshot: string;
}

export interface StoreOrderDto {
    id: string;
    // TODO time: LocalDateTime;
    storeId: string;
    storeSnapshot: string;
}

export async function getUserOrders(this: SDK, pageable: pageable): Promise<UserOrderDto[]> {
    const response = await this.get(`${order}`, pageable);

    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching user orders: ${error}`);
    }

    const result = (await response.json()) as UserOrderDto[];
    return result;
}

export async function getOrderById(this: SDK, id: string): Promise<UserOrderDto> {
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

export async function getStoreOrders(this: SDK, storeId: string, pageable: pageable): Promise<StoreOrderDto[]> {
    const response = await this.get(`${order}/${store}/${storeId}`, pageable);

    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching store orders: ${error}`);
    }

    const result = (await response.json()) as StoreOrderDto[];
    return result;
    
}