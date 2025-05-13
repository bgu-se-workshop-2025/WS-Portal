import * as auth from "./modules/auth/auth";

import * as order from "./modules/order/order";
import * as publicOrder from "./modules/order/publicOrder";

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

import { TokenService } from "../shared/utils/token";

import * as dtos from "../shared/types/dtos";
import * as requests from "../shared/types/requests";
import * as responses from "../shared/types/responses";

interface SDKOptions {
  baseUrl: string;
}

export class SDK {

  public login!: (payload: requests.LoginUserRequest) => Promise<responses.GeneralAuthResponse>;
  public register!: (payload: requests.RegisterUserRequest) => Promise<responses.GeneralAuthResponse>;
  public updatePublicUserProfileDetails!: (id: string, payload: dtos.UpdatePublicUserDto) => Promise<dtos.PublicUserDto>;
  public createMessage!: (payload: dtos.MessageDto) => Promise<dtos.MessageDto>;
  public getMessages!: (page?: number, size?: number) => Promise<dtos.MessageDto[]>;
  public getSentMessages!: (page?: number, size?: number) => Promise<dtos.MessageDto[]>;
  public getMessageById!: (messageId: string) => Promise<dtos.MessageDto>;
  public updateMessage!: (messageId: string, payload: dtos.MessageDto) => Promise<dtos.MessageDto>;
  public deleteMessage!: (messageId: string) => Promise<void>;
  public getStore!: (id: string) => Promise<dtos.StoreDto>;
  public getStoreOfficials!: (storeId: string) => Promise<dtos.PublicUserDto[]>;
  public addSeller!: (storeId: string, payload: dtos.SellerDto) => Promise<dtos.SellerDto>;
  public removeSeller!: (storeId: string, sellerId: string) => Promise<void>;

  private options: SDKOptions;

  constructor(options: SDKOptions) {
    this.options = options;

    Object.assign(this, {
      ...auth,

      ...order,
      ...publicOrder,

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
    });
  }

  private getHeaders(): Record<string, string> {
    const token = TokenService.token;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  public async post(endpoint: string, payload: any): Promise<Response> {
    return await fetch(`${this.options.baseUrl}/${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
  }

  public async patch(endpoint: string, payload: any): Promise<Response> {
    return await fetch(`${this.options.baseUrl}/${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
  }

  public async get(endpoint: string, params: Record<string, any>): Promise<Response> {
    const queryString = new URLSearchParams(params).toString();
    return await fetch(`${this.options.baseUrl}/${endpoint}?${queryString}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  public async delete(endpoint: string): Promise<Response> {
    return await fetch(`${this.options.baseUrl}/${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
  }
}

export const sdk: SDK = new SDK({
  baseUrl: "http://localhost:8080",
});

export const isAuthenticated = (): boolean => TokenService.isAuthenticated;
