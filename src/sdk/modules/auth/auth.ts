import { SDK } from "../../sdk.ts";

const controller = "auth";

interface LoginPayload {
  username: string;
  password: string;
}

export async function login(this: SDK, payload: LoginPayload): Promise<void> {
  const response = await fetch(
    `${this.getOptions().baseUrl}/${controller}/login`,
    {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  // ...
}
