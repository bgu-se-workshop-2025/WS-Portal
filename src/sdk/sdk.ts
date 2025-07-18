import * as auth from "./modules/auth/auth";

import * as order from "./modules/order/order";
import * as publicOrder from "./modules/order/publicOrder";
import * as bidding from "./modules/order/bidding";
import * as auction from "./modules/order/auction";

import * as policy from "./modules/store/policy";
import * as product from "./modules/store/product";
import * as publicReview from "./modules/store/publicReview";
import * as publicStore from "./modules/store/publicStore";
import * as review from "./modules/store/review";
import * as store from "./modules/store/store";
import * as storeRequest from "./modules/store/storeRequest";

import * as admin from "./modules/user/admin";
import * as cart from "./modules/user/cart";
import * as message from "./modules/user/message";
import * as publicUser from "./modules/user/publicUser";
import * as user from "./modules/user/user";

import * as notifications from "./modules/notification/notification";

import { TokenService } from "../shared/utils/token";
import type { ErrorContext } from "../shared/types/errors";
import { AppErrorFactory } from "../shared/types/errors";

import * as dtos from "../shared/types/dtos";
import * as requests from "../shared/types/requests";
import * as responses from "../shared/types/responses";
import { DiscountDto } from "./modules/store/policy";

interface SDKOptions {
  baseUrl: string;
}

export class SDK {
  // Admin SDK
  public suspendUser!: (username: string, millis: number) => Promise<string>;
  public cancelSuspensionUser!: (username: string) => Promise<void>;
  public getSuspensions!: (page: number, limit: number) => Promise<dtos.SuspensionTicketDto[]>;
  public elevateUser!: (username: string) => Promise<string>;
  public isAdmin!: () => Promise<dtos.AdminDetailsDto>;

  // Auth SDK
  public login!: (payload: requests.LoginUserRequest) => Promise<responses.GeneralAuthResponse>;
  public register!: (payload: requests.RegisterUserRequest) => Promise<responses.GeneralAuthResponse>;
  public updatePublicUserProfileDetails!: (id: string, payload: dtos.UpdatePublicUserDto) => Promise<dtos.PublicUserDto>;

  // User SDK
  public getCurrentUserProfileDetails!: () => Promise<dtos.PublicUserDto>;
  public getPublicUserProfileDetails!: (
    id: string
  ) => Promise<dtos.PublicUserDto>;
    public getPublicUserProfileDetailsByUsername!: (username: string) => Promise<dtos.PublicUserDto>;


  // Message SDK
  public createMessage!: (payload: dtos.MessageDto) => Promise<dtos.MessageDto>;
  public getMessages!: (page?: number, size?: number) => Promise<dtos.MessageDto[]>;
  public getSentMessages!: (page?: number, size?: number) => Promise<dtos.MessageDto[]>;
  public getMessageById!: (messageId: string) => Promise<dtos.MessageDto>;
  public updateMessage!: (messageId: string, payload: dtos.MessageDto) => Promise<dtos.MessageDto>;
  public deleteMessage!: (messageId: string) => Promise<void>;

  // Store Request SDK
  public getStoreRequests!: (storeId: string, page?: number, size?: number) => Promise<dtos.MessageDto[]>;
  public getStoreResponses!: (storeId: string, page?: number, size?: number) => Promise<dtos.MessageDto[]>;
  public respondToStoreRequest!: (storeId: string, messageId: string, response: dtos.MessageDto) => Promise<dtos.MessageDto>;
  public updateStoreResponse!: (storeId: string, responseId: string, response: dtos.MessageDto) => Promise<dtos.MessageDto>;
  public deleteStoreResponse!: (storeId: string, responseId: string) => Promise<void>;

  // Product SDK
  public getProduct!: (id: string) => Promise<dtos.ProductDto>;
  public getProducts!: (payload: requests.GetProductsPayload) => Promise<dtos.ProductDto[]>;

  // Review SDK
  public createStoreReview!: (payload: dtos.ReviewDto) => Promise<dtos.ReviewDto>;
  public createProductReview!: (payload: dtos.ReviewDto) => Promise<dtos.ReviewDto>;

  // Store SDK
  public createStore!: (payload: dtos.StoreDto) => Promise<dtos.StoreDto>;
  public updateStore!: (storeId: string, payload: dtos.StoreDto) => Promise<dtos.StoreDto>;
  public deleteStore!: (storeId: string) => Promise<void>;
  public closeStore!: (storeId: string) => Promise<void>;
  public createProduct!: (storeId: string, payload: dtos.ProductDto) => Promise<dtos.ProductDto>;
  public updateProduct!: (storeId: string, productId: string, payload: dtos.ProductDto) => Promise<dtos.ProductDto>;
  public deleteProduct!: (storeId: string, productId: string) => Promise<void>;
  public getSeller!: (storeId: string, sellerId: string) => Promise<dtos.SellerDto>;
  public addSeller!: (storeId: string, userId: string, payload: dtos.SellerDto) => Promise<dtos.SellerDto>;
  public removeSeller!: (storeId: string, sellerId: string) => Promise<void>;
  public updateManagerPermissions!: (storeId: string, sellerId: string, permissions: string[]) => Promise<dtos.SellerDto>;

  // Public Store SDK
  public getStore!: (id: string) => Promise<dtos.StoreDto>;
  public getStores!: (pageable: dtos.Pageable) => Promise<dtos.StoreDto[]>;
  public getStoreOfficials!: (storeId: string) => Promise<dtos.PublicUserDto[]>;
  public getStorePermissions!: () => Promise<string[]>;
  public getStoreSnapshotById!: (snapshotId: string) => Promise<dtos.StoreSnapshotDto>;
    public getPublicSellersInfo!: (storeId: string) => Promise<Record<string, string>>;


  // Order SDK
  public getUserOrders!: (payload: dtos.Pageable) => Promise<dtos.UserOrderDto[]>;
  public getUserOrderById!: (id: string) => Promise<dtos.UserOrderDto>;
  public getStoreOrderById!: (orderId: string, storeId: string) => Promise<dtos.StoreOrderDto>;
  public getStoreOrders!: (storeId: string, payload: dtos.Pageable) => Promise<dtos.StoreOrderDto[]>;

  // Public Order SDK
  public createOrder!: (payload: dtos.OrderRequestDetails) => Promise<dtos.UserOrderDto>;
  public createOrderForBid!: (payload: dtos.BidOrderRequestDetails) => Promise<dtos.UserOrderDto>;

  // Bidding SDK
  public createBidRequest!: (payload: dtos.BidRequestDto) => Promise<dtos.BidRequestDto>;
  public acceptBidRequest!: (bidRequestId: string) => Promise<void>;
  public rejectBidRequest!: (bidRequestId: string) => Promise<void>;
  public submitAlternativePrice!: (bidRequestId: string, newPrice: number) => Promise<void>;
  public cancelBidRequest!: (bidRequestId: string) => Promise<void>;
  public getBidRequest!: (bidRequestId: string) => Promise<dtos.BidRequestDto>;
  public getBid!: (bidRequestId: string) => Promise<dtos.BidDto>;
  public getBidsOfProduct!: (productId: string, payload: dtos.Pageable) => Promise<dtos.BidDto[]>;
  public getBidsOfUser!: (userId: string, payload: dtos.Pageable) => Promise<dtos.BidDto[]>;
  public getBidsOfStore!: (storeId: string, payload: dtos.Pageable) => Promise<dtos.BidDto[]>;
  public getBidRequestsOfProduct!: (productId: string, payload: dtos.Pageable) => Promise<dtos.BidRequestDto[]>;
  public getBidRequestsOfUser!: (userId: string, payload: dtos.Pageable) => Promise<dtos.BidRequestDto[]>;
  public getBidRequestsOfStore!: (storeId: string, payload: dtos.Pageable) => Promise<dtos.BidRequestDto[]>;
  public deleteBidRequest!: (bidRequestId: string) => Promise<void>;
  public deleteBid!: (bidRequestId: string) => Promise<void>;
  public getSellersRemaining!: (bidRequestId: string) => Promise<String[]>;

  // Auction SDK
  public placeBid!: (productId: string, payload: dtos.AuctionBidDto) => Promise<dtos.AuctionBidDto>;
  public getBids!: (productId: string, pageable: dtos.Pageable) => Promise<dtos.AuctionBidDto[]>;
  public getWinningBid!: (productId: string) => Promise<dtos.AuctionBidDto>;
  public getWinningBidPrice!: (productId: string) => Promise<number>;

  // Public Review SDK
  public getStoreReviews!: (storeId: string, page?: number, size?: number) => Promise<dtos.ReviewDto[]>;
  public getProductReviews!: (storeId: string, productId: string, page?: number, size?: number) => Promise<dtos.ReviewDto[]>;

  // Discount Policy SDK
  public getDiscountPolicy!: (storeId: string, policyId: string) => Promise<DiscountDto>;
  public getDiscountPolicies!: (storeId: string, productId?: string) => Promise<DiscountDto[]>;
  public createDiscountPolicy!: (storeId: string, policy: DiscountDto, productId?: string) => Promise<DiscountDto>;
  public deleteDiscountPolicy!: (storeId: string, policyId: string, productId?: string) => Promise<void>;

  // Cart SDK
  public getCart!: () => Promise<dtos.CartDto>;
  public addProductToCart!: (productId: string, payload: { quantity: number }) => Promise<dtos.CartDto>;
  public removeProductFromCart!: (productId: string) => Promise<void>;
  public updateProductInCart!: (productId: string, payload: { quantity: number }) => Promise<dtos.CartDto>;
  public getCartSnapshotById!: (snapshotId: string) => Promise<any>;

  // Notification SDK
  public getNotifications!: (payload: dtos.Pageable) => Promise<responses.NotificationPayload[]>;

  private options: SDKOptions;

  constructor(options: SDKOptions) {
    this.options = options;

    Object.assign(this, {
      ...auth,
      ...order,
      ...publicOrder,
      ...bidding,
      ...auction,
      ...policy,
      ...product,
      ...publicReview,
      ...publicStore,
      ...review,
      ...store,
      ...storeRequest,
      ...admin,
      ...cart,
      ...message,
      ...publicUser,
      ...user,
      ...notifications,
    });
  }

  private getHeaders(): Record<string, string> {
    const token = TokenService.token;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Helper to build URLs without double slashes
  private buildUrl(endpoint: string): string {
    return `${this.options.baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  }

  // Enhanced error handling for HTTP responses
  private async handleResponse<T>(
    responsePromise: Promise<Response>,
    context?: ErrorContext,
    parser?: (response: Response) => Promise<T>
  ): Promise<T> {
    let response: Response;
    
    try {
      response = await responsePromise;
    } catch (error) {
      // Network error - fetch failed completely
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw AppErrorFactory.fromNetworkError(error, context);
        }
      }
      throw AppErrorFactory.fromGenericError(error instanceof Error ? error : new Error('Unknown error occurred'), context);
    }

    // Handle HTTP errors
    if (!response.ok) {
      const responseBody = await response.text();
      throw AppErrorFactory.fromHttpError(response, responseBody, context);
    }

    // Handle successful responses
    try {
      // Use custom parser if provided
      if (parser) {
        return await parser(response);
      }

      // Handle successful responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json() as T;
      }

      // Return empty object for successful responses without content
      return {} as T;
    } catch (error) {
      // JSON parsing error or other processing error
      throw AppErrorFactory.fromGenericError(error instanceof Error ? error : new Error('Response processing failed'), context);
    }
  }

  public async post(endpoint: string, payload: any): Promise<Response> {
    return await fetch(this.buildUrl(endpoint), {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
  }

  public async patch(endpoint: string, payload: any): Promise<Response> {
    return await fetch(this.buildUrl(endpoint), {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
  }

  public async get(
    endpoint: string,
    params: Record<string, any>
  ): Promise<Response> {
    const queryString = new URLSearchParams(params).toString();
    return await fetch(
      `${this.buildUrl(endpoint)}?${queryString}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );
  }

  public async delete(endpoint: string): Promise<Response> {
    return await fetch(this.buildUrl(endpoint), {
      method: "DELETE",
      headers: this.getHeaders(),
    });
  }

  // Enhanced methods with error handling and parsing
  public async postWithErrorHandling<T>(endpoint: string, payload: any, context?: ErrorContext): Promise<T> {
    const responsePromise = fetch(this.buildUrl(endpoint), {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    
    return this.handleResponse<T>(responsePromise, {
      operation: `POST ${endpoint}`,
      ...context
    });
  }

  public async patchWithErrorHandling<T>(endpoint: string, payload: any, context?: ErrorContext): Promise<T> {
    const responsePromise = fetch(this.buildUrl(endpoint), {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    return this.handleResponse<T>(responsePromise, {
      operation: `PATCH ${endpoint}`,
      ...context
    });
  }

  public async getWithErrorHandling<T>(
    endpoint: string,
    params: Record<string, any>,
    context?: ErrorContext
  ): Promise<T> {
    const queryString = new URLSearchParams(params).toString();
    const responsePromise = fetch(
      `${this.buildUrl(endpoint)}?${queryString}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse<T>(responsePromise, {
      operation: `GET ${endpoint}`,
      ...context
    });
  }

  public async deleteWithErrorHandling<T>(endpoint: string, context?: ErrorContext): Promise<T> {
    const responsePromise = fetch(this.buildUrl(endpoint), {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(responsePromise, {
      operation: `DELETE ${endpoint}`,
      ...context
    });
  }
}

export const sdk: SDK = new SDK({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

export const isAuthenticated = (): boolean => TokenService.isAuthenticated;
