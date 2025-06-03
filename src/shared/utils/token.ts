import { jwtDecode } from "jwt-decode";
import { getTokenCookie, setTokenCookie, removeTokenCookie } from "./cookies";

interface JwtPayload {
  exp: number;
  iat: number;
  sub?: string;
  [key: string]: any;
}

export class TokenService {
  /** Save the token and set cookie to expire when JWT exp occurs */
  static saveToken(token: string) {
    const { exp, iat } = jwtDecode<JwtPayload>(token);
    const ttl = exp - iat;
    setTokenCookie(token, ttl);
  }

  /** Return the raw JWT, if set */
  static get token(): string | undefined {
    return getTokenCookie();
  }

  /** Clear the stored token */
  static clearToken() {
    removeTokenCookie();
  }

  /** Returns false if no token or token is expired */
  static get isAuthenticated(): boolean {
    const token = this.token;
    if (!token) return false;

    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  /** Decode payload or undefined if invalid */
  static get payload(): JwtPayload | undefined {
    const token = this.token;
    if (!token) return;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return;
    }
  }

  /** Returns the JWT subject (username), or undefined if no valid token */
  static get username(): string | undefined {
    const payload = this.payload;
    return payload?.sub;
  }
}
