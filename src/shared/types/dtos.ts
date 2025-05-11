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

export interface MessageDto {
    recipientId: string;
    title: string;
    body: string;
}
