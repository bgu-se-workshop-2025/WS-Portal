import { SDK } from "../../sdk.ts";
import {
  PublicUserDto,
  UpdatePublicUserDto,
} from "../../../shared/types/dtos.ts";

const controller = "users";

export async function getCurrentUserProfileDetails(this: SDK): Promise<PublicUserDto> {
  const response = await this.get(`${controller}/me`, {});

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to fetch current user profile: ${err}`);
  }

  const result = (await response.json()) as PublicUserDto;
  return result;
}

export async function updatePublicUserProfileDetails(this: SDK, id: string, payload: UpdatePublicUserDto): Promise<PublicUserDto> {
  const response = await this.patch(`${controller}/${id}`, payload);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to update user ${id}: ${err}`);
  }

  const result = (await response.json()) as PublicUserDto;
  return result;
}
