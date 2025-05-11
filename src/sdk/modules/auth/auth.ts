import { SDK } from "../../sdk.ts";
import { TokenService } from '../../../shared/utils/token.ts';

const controller = "auth";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(this: SDK, payload: LoginPayload): Promise<LoginResponse> {
  const response = await this.post(`auth/login`, payload);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Login failed: ${err}`);
  }

  const result = (await response.json()) as LoginResponse;
  TokenService.saveToken(result.token);
  return result;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export async function register(this: SDK, payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await this.post(`${controller}/register`, payload);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Register failed: ${err}`);
  }

  const result = await response.json() as RegisterResponse;
  return result;
}
