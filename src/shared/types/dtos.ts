export interface AdminDetailsDto {
    id: string;
}

export interface SuspensionTicketDto {
    username: string;
    issued: Date;
    ends: Date;
    status: string;
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
    rating?: number;
    purchasePolicies?: any[];
    discountPolicies?: any[];
}

export interface ProductDto {
    id?: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    storeId?: string;
    rating?: number;
    categories: string[];
    auctionEndDate?: string;
}

export interface SellerDto {
    id?: string;
    userId: string;
    storeId: string;
    type: SellerType;
    employerSellerId: string;
    permissions: string[];
}

export enum SellerType {
    OWNER = 0,
    MANAGER = 1,
    UNKNOWN = 2,
}

export interface MessageDto {
    id?: string;
    senderId?: string;
    recipientId: string;
    title: string;
    body: string;
    date?: string;
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
    id?: string;
    productId?: string;  
    storeId?: string;
    writerId?: string;
    title?: string;
    body?: string;
    rating?: number;
    date?: string;
}

export interface OrderRequestDetails {
    cart: CartDto;
    paymentDetails: PaymentDetails;
    shippingAddress: ShippingAddressDto;
}

export interface BidOrderRequestDetails {
    bidId: string;
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
    /**
     * @deprecated
     */
    paymentMethod?: PaymentMethod;

    externalId: string;
    payerEmail: string;
    payerId: string;

    paymentData: { [key: string]: string };
}

export type PaymentDetailsErrors = {
  holder?: string;
  id?: string;
  card_number?: string;
  cvv?: string;
  month?: string;
  year?: string;
  payerEmail?: string;
};

export type paymentDataKeys =
    | "currency"
    | "card_number"
    | "month"
    | "year"
    | "holder"
    | "cvv"
    | "id";

export enum PaymentMethod {
    CREDIT_CARD = 0,
    PAYPAL = 1,
    APPLE_PAY = 2,
    GOOGLE_PAY = 3,
}

export interface BidRequestDto {
    bidRequestId: string;
    userId: string;
    storeId: string;
    productId: string;
    price: number;
    requestStatus:  'PENDING' | 'ACCEPTED' | 'APPROVED' | 'RECEIVED_ALTERNATIVE_PRICE' | 'REJECTED' | 'CANCELLED';
}

export interface BidDto {
    id: string;
    userId: string;
    productId: string;
    price: number;
    storeId: string;
    isPurchased: boolean;
}

export interface AuctionBidDto {
  id?: string;
  productId: string;
  bidderId: string;
  bidPrice: number;
  paymentDetails: PaymentDetails;
  shippingAddress: ShippingAddressDto;
}

export interface ProductSnapshotDto {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
  discountPrice: number;
  auctionEndDate?: string;
}

export interface StoreSnapshotDto {
  id: string;
  storeId: string;
  name: string;
  description: string;
  products: ProductSnapshotDto[];
  price: number;
  discount: number;
}
