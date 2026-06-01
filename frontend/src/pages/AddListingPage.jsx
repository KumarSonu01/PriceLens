import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

const AddListingPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [productId, setProductId] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [deliveryInfo, setDeliveryInfo] =
    useState("");

  const [offer, setOffer] =
    useState("");

  const [stock, setStock] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          const { data } =
            await api.get(
              "/products"
            );

          setProducts(
            data.products
          );
        } catch (err) {
          console.log(err);
        }
      };

    fetchProducts();
  }, []);

  const submitHandler =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        setError("");

        const listingData = {
          product:
            productId,

          price,

          deliveryInfo,

          offer,

          stock,

          source:
            "Local Seller",
        };

        await api.post(
          "/listings",
          listingData
        );

        navigate(
          "/seller/dashboard"
        );
      } catch (err) {
        console.log(err);

        setError(
          err.response?.data
            ?.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        Add Listing
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-5">
          {error}
        </div>
      )}

      <form
        onSubmit={
          submitHandler
        }
        className="bg-white p-8 rounded-lg shadow space-y-5"
      >
        <div>
          <label className="block mb-2 font-semibold">
            Select Product
          </label>

          <select
            value={productId}
            onChange={(e) =>
              setProductId(
                e.target.value
              )
            }
            required
            className="w-full border p-3 rounded"
          >
            <option value="">
              Choose Product
            </option>

            {products.map(
              (product) => (
                <option
                  key={
                    product._id
                  }
                  value={
                    product._id
                  }
                >
                  {
                    product.title
                  }
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Price
          </label>

          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Delivery Info
          </label>

          <input
            type="text"
            value={deliveryInfo}
            onChange={(e) =>
              setDeliveryInfo(
                e.target.value
              )
            }
            placeholder="Within 2 Hours"
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Offer
          </label>

          <input
            type="text"
            value={offer}
            onChange={(e) =>
              setOffer(
                e.target.value
              )
            }
            placeholder="Free Screen Guard"
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Stock Status
          </label>

          <select
            value={stock}
            onChange={(e) =>
              setStock(
                e.target.value ===
                  "true"
              )
            }
            className="w-full border p-3 rounded"
          >
            <option value="true">
              In Stock
            </option>

            <option value="false">
              Out of Stock
            </option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
        >
          {loading
            ? "Creating..."
            : "Create Listing"}
        </button>
      </form>
    </div>
  );
};

export default AddListingPage;