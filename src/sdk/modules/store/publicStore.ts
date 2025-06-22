import { SDK } from "../../sdk";
import { StoreDto, Pageable, PublicUserDto } from "../../../shared/types/dtos.ts";

const publicStore: string = "public/stores";
const seller: string = "sellers";

export async function getStore(this: SDK, id: string): Promise<StoreDto> {
    const response = await this.get(`${publicStore}/${id}`, {}, { 
        action: 'getStore', 
        resource: 'store', 
        resourceId: id 
    });
    
    const result = (await response.json()) as StoreDto;
    return result;
}

export async function getStores(this: SDK, pageable: Pageable): Promise<StoreDto[]> {
    const response = await this.get(publicStore, pageable, { 
        action: 'getStores', 
        resource: 'stores' 
    });

    const result = (await response.json()) as StoreDto[];
    return result;
}

export async function getStoreOfficials(this: SDK, storeId: string): Promise<PublicUserDto[]> {
    const response = await this.get(`${publicStore}/${storeId}/${seller}`, {}, { 
        action: 'getStoreOfficials', 
        resource: 'store', 
        resourceId: storeId 
    });

    const result = (await response.json()) as PublicUserDto[];
    return result;
}

export async function getStorePermissions(this: SDK): Promise<string[]> {
  const response = await this.get("stores/permissions", {}, { 
    action: 'getStorePermissions', 
    resource: 'storePermissions' 
  });
  return (await response.json()) as string[];
}
