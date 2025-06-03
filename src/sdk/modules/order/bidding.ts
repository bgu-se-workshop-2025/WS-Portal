import { SDK } from "../../sdk";
import { BidRequestDto, BidDto, Pageable } from "../../../shared/types/dtos.ts";

const biddingController = "bids";
const productsController = "products";
const userController = "users";

export async function createBidRequest(this: SDK, BidRequestDto: BidRequestDto): Promise<BidRequestDto> {
    const response = await this.post(`${biddingController}`, BidRequestDto);
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create bid request: ${error}`);
    }
    
    const result = (await response.json()) as BidRequestDto;
    return result;
}

export async function acceptBidRequest(this: SDK, bidRequestId: string): Promise<void> {
    const response = await this.post(`${biddingController}/${bidRequestId}/accept`, {});

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to accept bid: ${error}`);
    }
}

export async function rejectBidRequest(this: SDK, bidRequestId: string): Promise<void> {
    const response = await this.post(`${biddingController}/${bidRequestId}/reject`, {});

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to reject bid: ${error}`);
    }
}

export async function submitAlternativePrice(this: SDK, bidRequestId: string, newPrice: number): Promise<void> {
    const response = await this.post(`${biddingController}/${bidRequestId}`, { newPrice });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to submit alternative price: ${error}`);
    }
}

export async function getBidRequest(this: SDK, bidRequestId: string): Promise<BidRequestDto> {
    const response = await this.get(`${biddingController}/${bidRequestId}`, {});

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get bid request: ${error}`);
    }

    const result = (await response.json()) as BidRequestDto;
    return result;
}

export async function getBid(this: SDK, bidRequestId: string): Promise<BidDto> {
    const response = await this.get(`${biddingController}/${bidRequestId}`, {});

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get bid: ${error}`);
    }

    const result = (await response.json()) as BidDto;
    return result;
}

export async function getBidsOfProduct(this: SDK, productId: string, pageable: Pageable): Promise<BidDto[]> {
    const response = await this.get(`${biddingController}/${productsController}/${productId}`, {productId, pageable});

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get bids of product: ${error}`);
    }

    const result = (await response.json()) as BidDto[];
    return result;
}

export async function getBidsOfUser(this: SDK, userId: string, pageable: Pageable): Promise<BidDto[]> {
    const response = await this.get(`${biddingController}/${userController}/${userId}`, pageable);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get bids of user: ${error}`);
    }

    const result = (await response.json()) as BidDto[];
    return result;
}

export async function getBidRequestsOfProduct(this: SDK, productId: string, pageable: Pageable): Promise<BidRequestDto[]> {
    const response = await this.get(`${biddingController}/requests/${productsController}/${productId}`, {productId, pageable});

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get bid requests of product: ${error}`);
    }

    const result = (await response.json()) as BidRequestDto[];
    return result;
}

export async function getBidRequestsOfUser(this: SDK, userId: string, pageable: Pageable): Promise<BidRequestDto[]> {
    const response = await this.get(`${biddingController}/requests/${userController}/${userId}`, pageable);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get bid requests of user: ${error}`);
    }

    const result = (await response.json()) as BidRequestDto[];
    return result;
}

export async function deleteBidRequest(this: SDK, bidRequestId: string): Promise<void> {
    const response = await this.delete(`${biddingController}/requests/${bidRequestId}`);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete bid request: ${error}`);
    }
}

export async function deleteBid(this: SDK, bidRequestId: string): Promise<void> {
    const response = await this.delete(`${biddingController}/${bidRequestId}`);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete bid: ${error}`);
    }
}
