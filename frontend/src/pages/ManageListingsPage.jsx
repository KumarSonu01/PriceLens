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

  const [
    editingListing,
    setEditingListing,
  ] = useState(null);

  const [
    formData,
    setFormData,
  ] = useState({
    price: "",

    stock: true,

    offer: "",

    deliveryInfo: "",
  });

  const fetchListings =
    async () => {
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

  const deleteHandler =
    async (id) => {
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

  const editHandler = (
    listing
  ) => {
    setEditingListing(
      listing._id
    );

    setFormData({
      price: listing.price,

      stock: listing.stock,

      offer: listing.offer,

      deliveryInfo:
        listing.deliveryInfo,
    });
  };

  const updateHandler =
    async (id) => {
      try {
        await api.put(
          `/listings/${id}`,
          formData
        );

        setEditingListing(
          null
        );

        fetchListings();
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
    <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold">
          Manage Listings
        </h1>

        <div className="bg-black text-white px-5 py-2 rounded-xl font-semibold">
          {listings.length} Listings
        </div>
      </div>

      <div className="grid gap-6">
        {listings.map(
          (listing) => (
            <div
              key={
                listing._id
              }
              className="bg-white rounded-2xl shadow p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex gap-5 items-start">
                  <img
                    src={
                      listing
                        .product
                        ?.images?.[0] ||
                      "https://via.placeholder.com/120"
                    }
                    alt={
                      listing
                        .product
                        ?.title
                    }
                    className="w-28 h-28 object-contain rounded-xl bg-gray-100 p-2"
                  />

                  <div>
                    <h2 className="text-2xl font-bold">
                      {
                        listing
                          .product
                          ?.title
                      }
                    </h2>

                    <p className="text-gray-500 mt-1 capitalize">
                      {
                        listing.source
                      }
                    </p>

                    {editingListing ===
                    listing._id ? (
                      <div className="mt-5 space-y-4">
                        <input
                          type="number"
                          value={
                            formData.price
                          }
                          onChange={(
                            e
                          ) =>
                            setFormData(
                              {
                                ...formData,
                                price:
                                  e
                                    .target
                                    .value,
                              }
                            )
                          }
                          placeholder="Price"
                          className="border border-gray-300 rounded-xl px-4 py-2 w-full"
                        />

                        <input
                          type="text"
                          value={
                            formData.offer
                          }
                          onChange={(
                            e
                          ) =>
                            setFormData(
                              {
                                ...formData,
                                offer:
                                  e
                                    .target
                                    .value,
                              }
                            )
                          }
                          placeholder="Offer"
                          className="border border-gray-300 rounded-xl px-4 py-2 w-full"
                        />

                        <input
                          type="text"
                          value={
                            formData.deliveryInfo
                          }
                          onChange={(
                            e
                          ) =>
                            setFormData(
                              {
                                ...formData,
                                deliveryInfo:
                                  e
                                    .target
                                    .value,
                              }
                            )
                          }
                          placeholder="Delivery Info"
                          className="border border-gray-300 rounded-xl px-4 py-2 w-full"
                        />

                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={
                              formData.stock
                            }
                            onChange={(
                              e
                            ) =>
                              setFormData(
                                {
                                  ...formData,
                                  stock:
                                    e
                                      .target
                                      .checked,
                                }
                              )
                            }
                          />

                          In Stock
                        </label>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() =>
                              updateHandler(
                                listing._id
                              )
                            }
                            className="bg-black text-white px-5 py-2 rounded-xl"
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              setEditingListing(
                                null
                              )
                            }
                            className="bg-gray-200 px-5 py-2 rounded-xl"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <p className="text-3xl font-bold text-green-600">
                          ₹
                          {listing.price.toLocaleString()}
                        </p>

                        <p className="text-gray-600">
                          {
                            listing.deliveryInfo
                          }
                        </p>

                        <p className="text-gray-600">
                          Offer:{" "}
                          {
                            listing.offer
                          }
                        </p>

                        <div
                          className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                            listing.stock
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {listing.stock
                            ? "In Stock"
                            : "Out of Stock"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {editingListing !==
                  listing._id && (
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        editHandler(
                          listing
                        )
                      }
                      className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteHandler(
                          listing._id
                        )
                      }
                      className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ManageListingsPage;