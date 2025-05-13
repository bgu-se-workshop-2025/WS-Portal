import { SDK } from "../../sdk.ts";
import { AdminDetailsDto } from "../../../shared/types/dtos";

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

/**
 * Elevates a user's authority to system admin.
 * @param this SDK instance
 * @param userId UUID of the user to elevate
 * @returns UUID of the elevated user
 */
export async function elevateUser(this: SDK, userId: string): Promise<string> {
  const response = await this.patch(`${controller}/users/${userId}`, {});
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Elevate user failed: ${err}`);
  }

  const result = await response.json() as string;
  return result;
}

/**
 * Checks if the current authenticated user is an admin.
 * @param this SDK instance
 * @returns AdminDetailsDto containing admin status
 */
export async function isAdmin(this: SDK): Promise<AdminDetailsDto> {
  const response = await this.get(`${controller}`, {});
  
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Check admin status failed: ${err}`);
  }
  
  const result = await response.json() as AdminDetailsDto;
  return result;
}
