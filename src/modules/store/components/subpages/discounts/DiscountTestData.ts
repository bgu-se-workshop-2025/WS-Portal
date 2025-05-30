import { DiscountDataModel } from "./DiscountTypes";

export const discountTestData: DiscountDataModel[] = [
  {
    type: "simple_discount_policy",
    id: 'discount-1',
    title: 'Summer Sale - 10% Off',
    description: '10% off all items this summer!',
    discountPercentage: 10,
  },
  {
    type: "greater_than_discount_policy",
    id: 'discount-2',
    title: '$5 Off Orders Over $50',
    description: 'Get $5 off when you spend $50 or more.',
    discountPercentage: 5,
    minTransactionPrice: 50,
  },
  {
    type: "category_discount_policy",
    id: 'discount-3',
    title: 'Back to School - 15% Off',
    description: '15% off all school supplies.',
    discountPercentage: 15,
    category: "school supplies",
  },
];