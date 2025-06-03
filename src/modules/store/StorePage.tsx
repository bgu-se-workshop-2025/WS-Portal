import React from "react";
import { useParams } from "react-router-dom";
import SellerStorePage from "./SellerStorePage";
import UserStorePage from "./UserStorePage";
import { sdk, isAuthenticated } from "../../sdk/sdk";

const StorePage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [isSeller, setIsSeller] = React.useState<boolean | null>(null);

  React.useEffect(() => {
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

  // Whichever layout we pick (Seller or User), it already contains its own <Outlet/>.
  // So here we simply render that layout. The child route (products / sellers / settings / discounts)
  // will then be injected into that layout's <Outlet />.
  return isSeller ? <SellerStorePage /> : <UserStorePage />;
};

export default StorePage;
