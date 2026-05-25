const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold capitalize">
            {listing.source}
          </h3>

          {listing.seller && (
            <p className="text-gray-600 mt-1">
              {listing.seller.shopName}
            </p>
          )}
        </div>

        <div className="text-3xl font-bold text-green-600">
          ₹{listing.price}
        </div>
      </div>

      <div className="mt-4">
        <p>
          Rating: {listing.rating} ⭐
        </p>

        <p>
          Reviews: {listing.reviewsCount}
        </p>

        <p>
          Delivery: {listing.deliveryInfo}
        </p>
      </div>

      <div className="mt-4">
        {listing.offers.map((offer, index) => (
          <div
            key={index}
            className="bg-green-100 text-green-700 px-3 py-1 rounded mb-2 inline-block mr-2"
          >
            {offer}
          </div>
        ))}
      </div>

      {listing.productUrl && (
        <a
          href={listing.productUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-5 bg-black text-white px-5 py-2 rounded"
        >
          Visit Store
        </a>
      )}
    </div>
  );
};

export default ListingCard;