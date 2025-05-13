interface UserStorePageProps {
    id?: string;
}

const UserStorePage: React.FC<UserStorePageProps> = ({ id }) => {
  return (
    <div>
      <h1>User Store Page</h1>
      <p>Store ID: {id}</p>
    </div>
  );
};

export default UserStorePage;
