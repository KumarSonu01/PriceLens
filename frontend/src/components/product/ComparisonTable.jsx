const ComparisonTable = ({
  listings,
  marketAverage,
  bestListingId,
}) => {
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
                City
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Price
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
                          "https://via.placeholder.com/40"
                        }
                        alt="seller"
                        className="w-10 h-10 rounded-full object-cover border"
                      />

                      <div>
                        <p className="font-semibold">
                          {listing
                            ?.seller
                            ?.shopName ||
                            listing
                              ?.seller
                              ?.name ||
                            "Unknown Seller"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {
                            listing
                              ?.seller
                              ?.email
                          }
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    {listing
                      ?.seller
                      ?.city || "-"}
                  </td>

                  <td className="p-4 capitalize">
                    {listing
                      ?.seller
                      ?.role
                      ?.replace(
                        "_",
                        " "
                      ) || "-"}
                  </td>

                  <td className="p-4 font-bold text-green-600">
                    ₹
                    {listing.price?.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {listing.stock}
                  </td>

                  <td className="p-4">
                    {listing._id ===
                    bestListingId ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Best Deal
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