import { SDK } from "../../sdk";
import { AuctionBidDto, Pageable } from "../../../shared/types/dtos";

const auctionController = "auctions";

/**
 * Place a bid on an auction product.
 * @param productId The ID of the product.
 * @param bid Detailes on the bid.
 * @returns The placed AuctionBidDto.
 */
export async function placeBid(
  this: SDK,
  productId: string,
  bid: AuctionBidDto
): Promise<AuctionBidDto> {
  const response = await this.post(
    `${auctionController}/${productId}/bid`,
    bid
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to place auction bid: ${error}`);
  }

  const result = (await response.json()) as AuctionBidDto;
  return result;
}

/**
 * Get all bids for an auction product.
 * @param productId The ID of the product.
 * @param pageable Optional pagination info (page, size).
 * @returns An array of AuctionBidDto objects.
 */
export async function getBids(
  this: SDK,
  productId: string,
  pageable: Pageable = { page: 0, size: 25 }
): Promise<AuctionBidDto[]> {
  const response = await this.get(
    `${auctionController}/${productId}/bids`,
    pageable
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get auction bids: ${error}`);
  }

  const result = (await response.json()) as AuctionBidDto[];
  return result;
}

/**
 * Get the winning bid for an auction product (or the bid that already won for an auction that is already over).
 * @param productId The ID of the product.
 * @returns The AuctionBidDto representing the winning bid.
 */
export async function getWinningBid(
  this: SDK,
  productId: string
): Promise<AuctionBidDto> {
  const response = await this.get(
    `${auctionController}/${productId}/winning-bid`,
    {}
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get winning bid: ${error}`);
  }

  const result = (await response.json()) as AuctionBidDto;
  return result;
}

/**
 * Gets only the price of the winning bid for a given auction product.
 * Backend may return null if no bids exist.
 * @param productId The ID of the product.
 * @returns The price of the winning bid, or null if no bids exist.
 */
export async function getWinningBidPrice(
  this: SDK,
  productId: string
): Promise<number | null> {
  const response = await this.get(
    `${auctionController}/${productId}/winning-bid/price`,
    {}
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get winning bid price: ${error}`);
  }

  const result = await response.json();
  return result as number | null;
}
