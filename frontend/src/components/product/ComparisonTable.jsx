const ComparisonTable = ({
  listings,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-4 text-left">
              Seller
            </th>

            <th className="p-4 text-left">
              Price
            </th>

            <th className="p-4 text-left">
              Stock
            </th>

            <th className="p-4 text-left">
              Type
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
                className="border-b"
              >
                <td className="p-4">
                  {listing
                    ?.seller
                    ?.name ||
                    "Seller"}
                </td>

                <td className="p-4 font-bold text-green-600">
                  ₹
                  {listing.price?.toLocaleString()}
                </td>

                <td className="p-4">
                  {
                    listing.stock
                  }
                </td>

                <td className="p-4">
                  {
                    listing
                      ?.seller
                      ?.role
                  }
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;