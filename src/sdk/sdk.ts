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

export interface SDKOptions {
  baseUrl: string;
}

export class SDK {
  private options: SDKOptions;

  constructor(options: SDKOptions) {
    this.options = options;

    Object.assign(this, {
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

  private getCookie(name: string): string | null {
    const match = document.cookie.match(
      new RegExp(
        "(?:^|; )" + name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1") + "=([^;]*)"
      )
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  public getToken(): string | null {
    return this.getCookie("token");
  }

  public getHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  public getOptions(): SDKOptions {
    return this.options;
  }
}
