import { SDK } from "../../sdk.ts";

const controller = "admin";

/**
 * Suspends a user for the given duration (in milliseconds).
 * @param this SDK instance
 * @param userId UUID of the user to suspend
 * @param millis Duration of suspension in milliseconds
 * @returns ISO string of when the suspension wears off
 */
export async function suspendUser(this: SDK, userId: string, millis: number): Promise<string> {
  const response = await this.post(`${controller}/users/${userId}`, millis);
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Suspend user failed: ${err}`);
  }
  
  const result = await response.json() as string;
  return result;
}
