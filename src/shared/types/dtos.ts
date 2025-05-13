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

export interface StoreDto {
    id: string;
    name: string;
    description: string;
}

export interface ProductDto {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    storeId: string;
    rating: number;
    categories: string[];
    auctionEndDate: string;
}

export interface SellerDto {
    id: string;
    userId: string;
    storeId: string;
    sellerType: SellerType;
    employerSellerId: string;
    employerUserId?: string;
    permissions: string[];
}

enum SellerType {
  OWNER = 0,
  MANAGER = 1,
  UNKNOWN = 2
}

export interface MessageDto {
    recipientId: string;
    title: string;
    body: string;
}

export interface Pageable {
    page: number;
    size: number;
}

export interface PublicUserDto {
  id: string;
  email: string;
  username: string;
  profilePictureUri: string;
}

export interface UserOrderDto {
    id: string;
    time: string;
    buyerId: string;
    shippingAddress: ShippingAddressDto;
    cartSnapshot: string;
}

export interface StoreOrderDto {
    id: string;
    time: string;
    storeId: string;
    storeSnapshot: string;
}

export interface ShippingAddressDto {
    country: string;
    city: string;
    region: string;
    street: string;
    zipCode: string;
    homeNumber: string;
    apartmentNumber: string;
    mailbox: string;
}
