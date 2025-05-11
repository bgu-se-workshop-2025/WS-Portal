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

interface SDKOptions {
  baseUrl: string;
}

export class SDK {
  public login!: (payload: auth.LoginPayload) => Promise<auth.LoginResponse>;

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
}

export const sdk: SDK = new SDK({
  baseUrl: "http://localhost:8080",
});

export const isAuthenticated = (): boolean => TokenService.isAuthenticated;
