import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../api/axios";

const WishlistPage = () => {
  const [wishlist, setWishlist] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchWishlist =
    async () => {
      try {
        const { data } =
          await api.get(
            "/wishlist"
          );

        setWishlist(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeHandler =
    async (id) => {
      try {
        await api.delete(
          `/wishlist/${id}`
        );

        setWishlist((prev) =>
          prev.filter(
            (item) =>
              item._id !== id
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Loading Wishlist...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold">
          My Wishlist
        </h1>

        <div className="bg-black text-white px-5 py-2 rounded-xl font-semibold">
          {wishlist.length} Saved
        </div>
      </div>

      {wishlist.length ===
      0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold">
            Wishlist Empty
          </h2>

          <p className="text-gray-500 mt-3">
            Save products to
            track them later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlist.map(
            (item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow p-5"
              >
                <img
                  src={
                    item.product
                      ?.images?.[0] ||
                    "https://via.placeholder.com/300"
                  }
                  alt={
                    item.product
                      ?.title
                  }
                  className="w-full h-64 object-contain bg-gray-100 rounded-xl p-4"
                />

                <h2 className="text-2xl font-bold mt-5">
                  {
                    item.product
                      ?.title
                  }
                </h2>

                <p className="text-gray-500 mt-2">
                  {
                    item.product
                      ?.brand
                  }
                </p>

                <div className="flex gap-3 mt-6">
                  <Link
                    to={`/product/${item.product._id}`}
                    className="flex-1 bg-black text-white py-3 rounded-xl text-center font-semibold"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      removeHandler(
                        item._id
                      )
                    }
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;