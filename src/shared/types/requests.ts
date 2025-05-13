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

export interface GetProductsPayload {
    page: number;
    size: number;
    storeId?: string;
    minPrice?: number;
    maxPrice?: number;
    keywords?: string[];
    categories?: string[];
    sortBy?: string;
}