export interface LoginUserRequest {
  username: string;
  password: string;
}

export interface RegisterUserRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}