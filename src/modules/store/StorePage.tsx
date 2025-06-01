import React from "react";
import { useParams } from "react-router-dom";

import SellerStorePage from "./SellerStorePage";
import UserStorePage from "./UserStorePage";
import { sdk, isAuthenticated } from "../../sdk/sdk";

const StorePage: React.FC = () => {
  const { id } = useParams();
  const [isSeller, setIsSeller] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!id || isAuthenticated() === false) {
        setIsSeller(false);
        return;
      }

      try {
        const me = await sdk.getCurrentUserProfileDetails();
        const mySeller = await sdk.getSeller(id, me.id);
        setIsSeller(mySeller !== null);
      } catch (err: any) {
        setIsSeller(false);
      }
    };

    fetchData();
  }, [id]);

  if (isSeller === null) {
    return <div>Loading...</div>;
  }

  return (
    <>{isSeller ? <SellerStorePage id={id} /> : <UserStorePage id={id} />}</>
  );
};

export default StorePage;
