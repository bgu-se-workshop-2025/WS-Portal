export interface AdminDetailsDto {
    id: string;
}

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
