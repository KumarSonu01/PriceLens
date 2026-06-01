import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "../api/axios";

const AdminListingsPage = () => {
  const [
    listings,
    setListings,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    deleting,
    setDeleting,
  ] = useState(null);

  const fetchListings =
    async () => {
      try {
        const { data } =
          await api.get(
            "/listings/admin/all"
          );

        setListings(
          data.listings
        );
      } catch (error) {
        console.log(error);

        toast.error(
          "Failed to load listings"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete =
    async (listingId) => {
      const confirmed =
        window.confirm(
          "Delete this listing?"
        );

      if (!confirmed)
        return;

      try {
        setDeleting(
          listingId
        );

        await api.delete(
          `/listings/${listingId}`
        );

        setListings(
          (
            prevListings
          ) =>
            prevListings.filter(
              (
                listing
              ) =>
                listing._id !==
                listingId
            )
        );

        toast.success(
          "Listing deleted"
        );
      } catch (error) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Delete failed"
        );
      } finally {
        setDeleting(
          null
        );
      }
    };

  if (loading) {
    return (
      <div className="p-10">
        Loading Listings...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        All Listings
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-4 text-left">
                Product
              </th>

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
                Action
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
                    {
                      listing
                        ?.product
                        ?.title
                    }
                  </td>

                  <td className="p-4">
                    {listing
                      ?.seller
                      ?.shopName ||
                      listing
                        ?.seller
                        ?.name}
                  </td>

                  <td className="p-4">
                    ₹
                    {listing.price}
                  </td>

                  <td className="p-4">
                    {listing.stock
                      ? "In Stock"
                      : "Out of Stock"}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleDelete(
                          listing._id
                        )
                      }
                      disabled={
                        deleting ===
                        listing._id
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      {deleting ===
                      listing._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminListingsPage;