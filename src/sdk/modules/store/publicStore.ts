import { SDK } from "../../sdk";

const publicStore: string = "public/stores";
const seller: string = "sellers";

export interface publicStore {
    id: string;
    name: string;
    description: string;
}

export async function getStore(this: SDK, id: string): Promise<publicStore> {
    const response = await this.get(`${publicStore}/${id}`, {});
    
    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching store: ${error}`);
    }

    const result = (await response.json()) as publicStore;
    return result;
}

export async function getStores(this: SDK, page: number, size: number): Promise<publicStore[]> {
    const response = await this.get(publicStore, {});
    
    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching stores: ${error}`);
    }

    const result = (await response.json()) as publicStore[];
    return result;
}

export async function getStoreOfficials(this: SDK, storeId: string): Promise<publicStore[]> {
    const response = await this.get(`${publicStore}/${storeId}/${seller}`, {});
    
    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching store officials: ${error}`);
    }

    const result = (await response.json()) as publicStore[];
    return result;
}