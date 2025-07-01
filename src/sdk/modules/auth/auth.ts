import { SDK } from "../../sdk.ts";
import { TokenService } from '../../../shared/utils/token.ts';
import type { ErrorContext } from '../../../shared/types/errors';

import { GeneralAuthResponse } from "../../../shared/types/responses.ts";
import { LoginUserRequest, RegisterUserRequest } from "../../../shared/types/requests.ts";

const controller = "auth";

export async function login(this: SDK, payload: LoginUserRequest, context?: ErrorContext): Promise<GeneralAuthResponse> {
  const result = await this.postWithErrorHandling<GeneralAuthResponse>(
    `${controller}/login`, 
    payload,
    {
      operation: 'User Login',
      component: 'LoginPage',
      ...context
    }
  );

  if (!result.token) {
    throw new Error("Login failed: No token received");
  }

  TokenService.saveToken(result.token);
  return result;
}

export async function register(this: SDK, payload: RegisterUserRequest, context?: ErrorContext): Promise<GeneralAuthResponse> {
  return await this.postWithErrorHandling<GeneralAuthResponse>(
    `${controller}/register`, 
    payload,
    {
      operation: 'User Registration',
      component: 'RegisterPage',
      ...context
    }
  );
}
