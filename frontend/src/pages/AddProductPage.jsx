import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

const AddProductPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [image, setImage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const productData = {
        title,
        brand,
        category,
        description,
        images: [image],
        specifications: {
          RAM: "8GB",
          Storage: "256GB",
        },
        features: [
          "Flagship",
          "Fast Charging",
        ],
      };

      await api.post(
        "/products",
        productData
      );

      navigate("/seller/dashboard");
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        Add Product
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-5">
          {error}
        </div>
      )}

      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-lg shadow space-y-5"
      >
        <div>
          <label className="block mb-2 font-semibold">
            Product Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Brand
          </label>

          <input
            type="text"
            value={brand}
            onChange={(e) =>
              setBrand(e.target.value)
            }
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Category
          </label>

          <input
            type="text"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Description
          </label>

          <textarea
            rows="4"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Image URL
          </label>

          <input
            type="text"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded"
        >
          {loading
            ? "Creating..."
            : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;