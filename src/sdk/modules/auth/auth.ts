import { SDK } from "../../sdk.ts";
import { TokenService } from '../../../shared/utils/token.ts';

import { GeneralAuthResponse } from "../../../shared/types/responses.ts";
import { LoginUserRequest, RegisterUserRequest } from "../../../shared/types/requests.ts";

const controller = "auth";

export async function login(this: SDK, payload: LoginUserRequest): Promise<GeneralAuthResponse> {
  const response = await this.post(`${controller}/login`, payload);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Login failed: ${err}`);
  }

  const result = await response.json() as GeneralAuthResponse;
  if (!result.token) {
    throw new Error("Login failed: No token received");
  }

  TokenService.saveToken(result.token);
  return result;
}

export async function register(this: SDK, payload: RegisterUserRequest): Promise<GeneralAuthResponse> {
  const response = await this.post(`${controller}/register`, payload);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Register failed: ${err}`);
  }

  const result = await response.json() as GeneralAuthResponse;
  return result;
}
