import React, { useEffect, useState } from "react";
import { ProductDto } from "../../shared/types/dtos";

const mockProduct: ProductDto = {
  id: "test-product-001",
  name: "Test Product",
  description: "This is a sample product used for testing the cart page.",
  price: 49.99,
  quantity: 100,
  storeId: "store-001",
  rating: 4.5,
  categories: ["Electronics", "Gadgets"],
  auctionEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

const CartTestPage: React.FC = () => {
  const [product, setProduct] = useState<ProductDto | null>(null);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setProduct(mockProduct);
    }, 500);
  }, []);

  if (!product) return <div>Loading product...</div>;

  return (
    <div>
      <h2>🛒 Cart Test Page</h2>
      <div>
        <strong>{product.name}</strong>
        <p>{product.description}</p>
        <p>💰 ${product.price}</p>
        <p>📦 In stock: {product.quantity}</p>
        <p>⭐ Rating: {product.rating}/5</p>
      </div>
    </div>
  );
};

export default CartTestPage;
