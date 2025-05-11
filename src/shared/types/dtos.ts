export interface PublicUserDto {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdatePublicUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}
