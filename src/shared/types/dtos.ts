export interface AdminDetailsDto {
    id: string;
}

export interface SuspensionTicketDto {
    username: string;
    issued: Date;
    ends: Date;
    status: string;
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

export interface StoreDto {
    id?: string;
    name: string;
    description: string;
    rating: number;
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
    permissions: string[];
}

export enum SellerType {
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

export interface ReviewDto {
    id: string | null;
    productId: string | null;  
    storeId: string;
    writerId: string;
    title: string | null;
    body: string | null;
    rating: number;
    date: string | null;
}

export interface OrderRequestDetails {
    cart: CartDto;
    paymentDetails: PaymentDetails;
    shippingAddress: ShippingAddressDto;
}

export interface CartDto {
    ownerId?: string;
    stores: CartStoreBasketDto[];
}

export interface CartStoreBasketDto {
    storeId: string;
    products: CartProductEntryDto[];
}

export interface CartProductEntryDto {
    productId: string;
    quantity: number;
}

export interface PaymentDetails {
    paymentMethod: PaymentMethod;
    externalId: string;
    payerEmail: string;
    payerId: string;
}

export enum PaymentMethod {
    CREDIT_CARD = 0,
    PAYPAL = 1,
    APPLE_PAY = 2,
    GOOGLE_PAY = 3,
}

export interface BidRequestDto {
    storeId: string;
    productId: string;
    price: number;
    bidRequestStatus: BidRequestStatus;
}

export enum BidRequestStatus {
    PENDING = 0,
    ACCEPTED = 1,
    APPROVED = 2,
    RECEIVED_ALTERNATIVE_PRICE = 3,
    REJECTED = 4
}

export interface BidDto {
    id: string;
    userId: string;
    productId: string;
    price: number;
}
