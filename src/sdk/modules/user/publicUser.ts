import { SDK } from "../../sdk.ts";
import { PublicUserDto } from "../../../shared/types/dtos.ts";

const controller = "public/users";

export async function getPublicUserProfileDetails(this: SDK, id: string): Promise<PublicUserDto> {
  const response = await this.get(`${controller}/${id}`, {});

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to get user ${id}: ${err}`);
  }

  const result = (await response.json()) as PublicUserDto;
  return result;
}

export async function getPublicUserProfileDetailsByUsername(this: SDK, username: string): Promise<PublicUserDto> {
  const response = await this.get(`${controller}/name/${username}`, {});

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to get user by username "${username}": ${err}`);
  }

  const result = (await response.json()) as PublicUserDto;
  return result;
}
