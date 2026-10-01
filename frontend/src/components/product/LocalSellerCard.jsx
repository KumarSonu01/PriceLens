const LocalSellerCard = ({
  seller,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">

      <h3 className="font-bold text-lg">
        {seller.shopName}
      </h3>

      <p className="text-gray-600">
        {seller.city}
      </p>

      <p className="text-gray-600">
        {seller.phone}
      </p>


      {seller.storeLink ? (

        <a
          href={seller.storeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800"
        >
          Visit Store →
        </a>

      ) : (

        <button
          disabled
          className="mt-4 bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
        >
          Store Link Unavailable
        </button>

      )}

    </div>
  );
};


export default LocalSellerCard;