import React from "react";
import { useParams } from "react-router-dom";

import SellerStorePage from "./seller/SellerStorePage";
import UserStorePage from "./user/UserStorePage";

const StorePage: React.FC = () => {
  const { id } = useParams();

  // TODO: Change with real endpoint
  const isSeller = true; // Replace with actual logic to determine if the user is a seller

  return (
    <>{isSeller ? <SellerStorePage id={id} /> : <UserStorePage id={id} />}</>
  );
};

export default StorePage;
