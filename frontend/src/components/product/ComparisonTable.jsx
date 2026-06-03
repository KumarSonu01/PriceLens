const ComparisonTable = ({
  listings,
  marketAverage,
  bestListingId,
}) => {
  const getSourceLogo = (
    source
  ) => {
    if (
      source === "Amazon"
    ) {
      return "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg";
    }

    if (
      source ===
      "Flipkart"
    ) {
      return "https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/fk-logo_f64bb3.png";
    }

    return "https://via.placeholder.com/40";
  };

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="p-5 border-b">
        <h2 className="text-2xl font-bold">
          Compare Sellers
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-4 text-left">
                Seller
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Delivery
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

              <th className="p-4 text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {listings.map(
              (listing) => (
                <tr
                  key={
                    listing._id
                  }
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          listing
                            ?.seller
                            ?.avatar ||
                          getSourceLogo(
                            listing.source
                          )
                        }
                        alt={
                          listing.source
                        }
                        className="w-10 h-10 rounded-full object-contain border bg-white p-1"
                      />

                      <div>
                        <p className="font-semibold">
                          {listing
                            ?.seller
                            ?.shopName ||
                            listing
                              ?.seller
                              ?.name ||
                            listing.source ||
                            "Unknown Seller"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {listing
                            ?.seller
                            ?.email ||
                            listing.source}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    {listing.isScraped
                      ? "Marketplace"
                      : "Local Seller"}
                  </td>

                  <td className="p-4 font-bold text-green-600">
                    ₹
                    {listing.price?.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {listing.deliveryInfo ||
                      "Not specified"}
                  </td>

                  <td className="p-4">
                    {listing.stock ? (
                      <span className="text-green-600 font-semibold">
                        🟢 In Stock
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        🔴 Out of Stock
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {listing._id ===
                    bestListingId ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        🏆 Best Deal
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 text-sm text-gray-600 flex justify-between">
        <span>
          Total Sellers:{" "}
          {listings.length}
        </span>

        <span>
          Market Average: ₹
          {marketAverage.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ComparisonTable;