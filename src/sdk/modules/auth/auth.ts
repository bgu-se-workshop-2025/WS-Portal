import { SDK } from "../../sdk.ts";
import { TokenService } from '../../../shared/utils/token.ts';
import { ErrorHandler } from '../../../shared/utils/errorHandler.ts';

import { GeneralAuthResponse } from "../../../shared/types/responses.ts";
import { LoginUserRequest, RegisterUserRequest } from "../../../shared/types/requests.ts";

const controller = "auth";

export async function login(this: SDK, payload: LoginUserRequest): Promise<GeneralAuthResponse> {
  const context = ErrorHandler.createContext('AuthModule', 'login', { username: payload.username });
  
  const response = await this.post(`${controller}/login`, payload, context);

  const result = await response.json() as GeneralAuthResponse;
  if (!result.token) {
    throw ErrorHandler.processError("Login failed: No token received", context);
  }

  TokenService.saveToken(result.token);
  return result;
}

export async function register(this: SDK, payload: RegisterUserRequest): Promise<GeneralAuthResponse> {
  const context = ErrorHandler.createContext('AuthModule', 'register', { 
    username: payload.username,
    email: payload.email 
  });
  
  const response = await this.post(`${controller}/register`, payload, context);

  const result = await response.json() as GeneralAuthResponse;
  return result;
}
