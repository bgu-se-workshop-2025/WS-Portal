interface SellerStorePageProps {
  id?: string;
}

const SellerStorePage: React.FC<SellerStorePageProps> = ({ id }) => {
  return (
    <div>
      <h1>Seller Store Page</h1>
      <p>Store ID: {id}</p>
    </div>
  );
};

export default SellerStorePage;
