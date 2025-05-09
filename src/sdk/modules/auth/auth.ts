import { SDK } from "../../sdk.ts";

const controller = "auth";

export interface LoginPayload {
  username: string;
  password: string;
};

export async function login(this: SDK, payload: LoginPayload): Promise<void> {
  console.log("Login payload:", payload);
  const response = await this.post(`${controller}/login`, payload);

  if (response.ok) {
    // Handle successful login, e.g., store token in cookies or local storage
  }
};

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
};

export async function register(this: SDK, payload: RegisterPayload): Promise<void> {
  console.log("Register payload:", payload);
  const response = await this.post(`${controller}/register`, payload);

  if (!response.ok) {
    throw new Error(response.statusText);
  }
};
