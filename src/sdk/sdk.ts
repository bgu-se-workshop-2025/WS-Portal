import * as auth from "./modules/auth/auth";

import * as order from "./modules/order/order";
import * as publicOrder from "./modules/order/publicOrder";
import * as bidding from "./modules/order/bidding";

import * as policy from "./modules/store/policy";
import * as product from "./modules/store/product";
import * as publicReview from "./modules/store/publicReview";
import * as publicStore from "./modules/store/publicStore";
import * as review from "./modules/store/review";
import * as store from "./modules/store/store";

import * as admin from "./modules/user/admin";
import * as cart from "./modules/user/cart";
import * as message from "./modules/user/message";
import * as publicUser from "./modules/user/publicUser";
import * as user from "./modules/user/user";

import * as notifications from "./modules/notification/notification";

import { TokenService } from "../shared/utils/token";

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
  // Order SDK
  public getUserOrders!: (payload: dtos.Pageable) => Promise<dtos.UserOrderDto[]>;
  public getUserOrderById!: (id: string) => Promise<dtos.UserOrderDto>;
  public getStoreOrderById!: (orderId: string, storeId: string) => Promise<dtos.StoreOrderDto>;
  public getStoreOrders!: (storeId: string, payload: dtos.Pageable) => Promise<dtos.StoreOrderDto[]>;

  // Public Order SDK
  public createOrder!: (payload: dtos.OrderRequestDetails) => Promise<dtos.UserOrderDto>;

  // Bidding SDK
  public createRequest!: (payload: dtos.BidRequestDto) => Promise<dtos.BidRequestDto>;
  public acceptBidRequest!: (bidRequestId: string) => Promise<void>;
  public rejectBidRequest!: (bidRequestId: string) => Promise<void>;
  public submitAlternativePrice!: (bidRequestId: string, newPrice: number) => Promise<void>;
  public getBidRequest!: (bidRequestId: string) => Promise<dtos.BidRequestDto>;
  public getBid!: (bidRequestId: string) => Promise<dtos.BidDto>;
  public getBidsOfProduct!: (productId: string, payload: dtos.Pageable) => Promise<dtos.BidDto[]>;
  public getBidsOfUser!: (payload: dtos.Pageable) => Promise<dtos.BidDto[]>;
  public getBidRequestsOfProduct!: (productId: string, payload: dtos.Pageable) => Promise<dtos.BidRequestDto[]>;
  public getBidRequestsOfUser!: (payload: dtos.Pageable) => Promise<dtos.BidRequestDto[]>;
  public deleteBidRequest!: (bidRequestId: string) => Promise<void>;
  public deleteBid!: (bidRequestId: string) => Promise<void>;

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
      ...policy,
      ...product,
      ...publicReview,
      ...publicStore,
      ...review,
      ...store,
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
}

export const sdk: SDK = new SDK({
  baseUrl: "http://localhost:8080",
});

export const isAuthenticated = (): boolean => TokenService.isAuthenticated;
