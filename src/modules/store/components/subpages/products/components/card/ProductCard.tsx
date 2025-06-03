import React from "react";
import { ProductDto } from "../../../../../../../shared/types/dtos";



import SellerProductCard from "./SellerProductCard";
import UserProductCard from "./UserProductCard";

interface ProductCardProps {
  product: ProductDto;
  setUpdateProducts: React.Dispatch<React.SetStateAction<boolean>>;
  isSeller: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  setUpdateProducts,
  isSeller,
}) => {
  return (
    <>
      {isSeller ? (
        <SellerProductCard product={product} setUpdateProducts={setUpdateProducts} />
      ) : (
        <UserProductCard product={product} setUpdateProducts={setUpdateProducts} />
      )}
    </>
  );
};

export default ProductCard;
