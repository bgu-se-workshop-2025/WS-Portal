import { SDK } from "../../sdk";
import { StoreDto, Pageable, PublicUserDto } from "../../../shared/types/dtos.ts";

const publicStore: string = "public/stores";
const seller: string = "sellers";

export async function getStore(this: SDK, id: string): Promise<StoreDto> {
    const response = await this.get(`${publicStore}/${id}`, {});
    
    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching store: ${error}`);
    }

    const result = (await response.json()) as StoreDto;
    return result;
}

export async function getStores(this: SDK, pageable: Pageable): Promise<StoreDto[]> {
    const response = await this.get(publicStore, pageable);
    
    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching stores: ${error}`);
    }

    const result = (await response.json()) as StoreDto[];
    return result;
}

export async function getStoreOfficials(this: SDK, storeId: string): Promise<PublicUserDto[]> {
    const response = await this.get(`${publicStore}/${storeId}/${seller}`, {});
    
    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Error fetching store officials: ${error}`);
    }

    const result = (await response.json()) as PublicUserDto[];
    return result;
}