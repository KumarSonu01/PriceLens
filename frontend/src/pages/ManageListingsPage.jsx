import {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const ManageListingsPage = () => {
  const [listings, setListings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchListings = async () => {
    try {
      setLoading(true);

      const { data } =
        await api.get(
          "/listings/my-listings"
        );

      setListings(data);
    } catch (err) {
      setError(
        "Failed to load listings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const deleteHandler = async (
    id
  ) => {
    try {
      await api.delete(
        `/listings/${id}`
      );

      setListings((prev) =>
        prev.filter(
          (listing) =>
            listing._id !== id
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-2xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-600 text-2xl">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-10">
        Manage Listings
      </h1>

      <div className="grid gap-5">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white p-5 rounded-lg shadow flex justify-between items-center"
          >
            <div className="flex gap-5 items-center">
              <img
                src={
                  listing.product
                    ?.images?.[0]
                }
                alt={
                  listing.product
                    ?.title
                }
                className="w-24 h-24 object-cover rounded"
              />

              <div>
                <h2 className="text-2xl font-bold">
                  {
                    listing.product
                      ?.title
                  }
                </h2>

                <p className="text-gray-600">
                  {listing.source}
                </p>

                <p className="text-green-600 text-xl font-bold mt-2">
                  ₹{listing.price}
                </p>

                <p className="mt-1">
                  {
                    listing.deliveryInfo
                  }
                </p>

                <p className="mt-1">
                  Offer:{" "}
                  {listing.offer}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                deleteHandler(
                  listing._id
                )
              }
              className="bg-red-600 text-white px-5 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageListingsPage;