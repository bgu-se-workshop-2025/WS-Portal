import { SDK } from "../../sdk.ts";
import {
    AdminDetailsDto,
    SuspensionTicketDto,
} from "../../../shared/types/dtos";

const controller = "admin";

/**
 * Suspends a user for the given duration (in milliseconds).
 * @param this      SDK instance
 * @param username  the user to suspend
 * @param millis    Duration of suspension in milliseconds
 * @returns ISO string of when the suspension wears off
 */
export async function suspendUser(
    this: SDK,
    username: string,
    millis: number
): Promise<string> {
    const response = await this.post(`${controller}/users/${username}`, millis);

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Suspend user failed: ${err}`);
    }

    const result = (await response.json()) as string;
    return result;
}

/**
 * Cancels the suspension of a user.
 * @param this      SDK instance
 * @param username  the user to cancel suspension
 */
export async function cancelSuspensionUser(
    this: SDK,
    username: string
): Promise<void> {
    const response = await this.delete(`${controller}/users/${username}`);

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Cancel suspension of user failed: ${err}`);
    }
}

/**
 * Retrieves a paginated list of suspension tickets.
 * @param this  SDK instance
 * @param page  the page number
 * @param limit the number of tickets per page
 * @returns   list of suspension tickets
 */
export async function getSuspensions(
    this: SDK,
    page: number,
    limit: number
): Promise<SuspensionTicketDto[]> {
    const response = await this.get(`${controller}/users`, {
        page: page,
        limit: limit,
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Suspend user failed: ${err}`);
    }

    const result = (await response.json()) as SuspensionTicketDto[];
    return result;
}

/**
 * Elevates a user's authority to system admin.
 * @param this      SDK instance
 * @param username  the user to elevate
 * @returns         UUID of the elevated user
 */
export async function elevateUser(
    this: SDK,
    username: string
): Promise<string> {
    const response = await this.patch(`${controller}/users/${username}`, {});

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Elevate user failed: ${err}`);
    }

    const result = (await response.json()) as string;
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

    const result = (await response.json()) as AdminDetailsDto;
    return result;
}
