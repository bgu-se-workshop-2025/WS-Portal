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

import { getCookie } from "../shared/utils/cookies";

interface SDKOptions {
  baseUrl: string;
}

export class SDK {

  public login!: (payload: auth.LoginPayload) => Promise<void>;

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

  private getHeaders(): { [key: string]: string } {
    const token = getCookie("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  public async post(endpoint: string, payload: any): Promise<Response> {
    return await fetch(`${this.options.baseUrl}/${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
  }
}

export const sdk: SDK = new SDK({
  baseUrl: "http://localhost:8080",
});
