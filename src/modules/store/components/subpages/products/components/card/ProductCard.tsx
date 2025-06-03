import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { ProductDto } from "../../../../../../../shared/types/dtos";
import { sdk, isAuthenticated } from "../../../../../../../sdk/sdk";

import SellerProductCard from "./SellerProductCard";
import UserProductCard from "./UserProductCard";

interface ProductCardProps {
  product: ProductDto;
  setUpdateProducts: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  setUpdateProducts,
}) => {
  const { storeId } = useParams<{ storeId: string }>();
  const [isSeller, setIsSeller] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId || isAuthenticated() === false) {
        setIsSeller(false);
        return;
      }
      try {
        const me = await sdk.getCurrentUserProfileDetails();
        const mySeller = await sdk.getSeller(storeId, me.id);
        setIsSeller(mySeller !== null);
      } catch (err: any) {
        setIsSeller(false);
      }
    };
    fetchData();
  }, [storeId]);

  if (isSeller === null) {
    return <div>Loading…</div>;
  }

  return isSeller ? (
    <SellerProductCard product={product} setUpdateProducts={setUpdateProducts} />
  ) : (
    <UserProductCard product={product} />
  );
};

export default ProductCard;
