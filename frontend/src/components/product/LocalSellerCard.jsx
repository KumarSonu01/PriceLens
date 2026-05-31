const LocalSellerCard = ({
  seller,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="font-bold text-lg">
        {seller.shopName}
      </h3>

      <p>{seller.city}</p>

      <p>{seller.phone}</p>
    </div>
  );
};

export default LocalSellerCard;