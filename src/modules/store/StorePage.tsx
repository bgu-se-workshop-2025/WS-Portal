import React from "react";
import { useParams } from "react-router-dom";

import SellerStorePage from "./SellerStorePage";
import UserStorePage from "./UserStorePage";

const StorePage: React.FC = () => {
  const { id } = useParams();

  // TODO: Change with real endpoint
  const isSeller = false; // Replace with actual logic to determine if the user is a seller

  return (
    <>{isSeller ? <SellerStorePage id={id} /> : <UserStorePage id={id} />}</>
  );
};

export default StorePage;
