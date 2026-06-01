import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../api/axios";

const EditProductPage = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [title, setTitle] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [ram, setRam] =
    useState("");

  const [storage, setStorage] =
    useState("");

  const [
    features,
    setFeatures,
  ] = useState("");

  const [image, setImage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    const fetchProduct =
      async () => {
        try {
          const { data } =
            await api.get(
              `/products/${id}`
            );

          setTitle(
            data.title
          );

          setBrand(
            data.brand
          );

          setCategory(
            data.category
          );

          setDescription(
            data.description
          );

          setRam(
            data
              ?.specifications
              ?.RAM || ""
          );

          setStorage(
            data
              ?.specifications
              ?.Storage || ""
          );

          setFeatures(
            data.features?.join(
              ", "
            ) || ""
          );

          setImage(
            data
              ?.images?.[0] ||
              ""
          );
        } catch (error) {
          console.log(error);

          toast.error(
            "Failed to load product"
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    fetchProduct();
  }, [id]);

  const submitHandler =
    async (e) => {
      e.preventDefault();

      try {
        setSaving(true);

        await api.put(
          `/products/${id}`,
          {
            title,
            brand,
            category,
            description,

            specifications:
              {
                RAM: ram,
                Storage:
                  storage,
              },

            features:
              features
                .split(",")
                .map(
                  (
                    feature
                  ) =>
                    feature.trim()
                )
                .filter(
                  Boolean
                ),

            images: [image],
          }
        );

        toast.success(
          "Product updated successfully"
        );

        navigate(
            "/admin/manage-products"
        );
      } catch (error) {
        console.log(error);

        toast.error(
          error?.response
            ?.data
            ?.message ||
            "Failed to update product"
        );
      } finally {
        setSaving(
          false
        );
      }
    };

  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        Edit Product
      </h1>

      <form
        onSubmit={
          submitHandler
        }
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
              setTitle(
                e.target.value
              )
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
              setBrand(
                e.target.value
              )
            }
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            required
            className="w-full border p-3 rounded"
          >
            <option value="">
              Select Category
            </option>

            <option value="Mobile">
              Mobile
            </option>

            <option value="Laptop">
              Laptop
            </option>

            <option value="Tablet">
              Tablet
            </option>

            <option value="Headphones">
              Headphones
            </option>

            <option value="Smartwatch">
              Smartwatch
            </option>

            <option value="Television">
              Television
            </option>

            <option value="Camera">
              Camera
            </option>

            <option value="Gaming">
              Gaming
            </option>

            <option value="Accessories">
              Accessories
            </option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Description
          </label>

          <textarea
            rows="4"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            RAM
          </label>

          <input
            type="text"
            value={ram}
            onChange={(e) =>
              setRam(
                e.target.value
              )
            }
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Storage
          </label>

          <input
            type="text"
            value={storage}
            onChange={(e) =>
              setStorage(
                e.target.value
              )
            }
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Features
          </label>

          <input
            type="text"
            value={features}
            onChange={(e) =>
              setFeatures(
                e.target.value
              )
            }
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
              setImage(
                e.target.value
              )
            }
            required
            className="w-full border p-3 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          {saving
            ? "Updating..."
            : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;