import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

const ManageProductsPage = () => {
  const navigate =
    useNavigate();

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    deleting,
    setDeleting,
  ] = useState(null);

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
      } catch (error) {
        console.log(error);

        toast.error(
          "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete =
    async (productId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeleting(
          productId
        );

        await api.delete(
          `/products/${productId}`
        );

        setProducts(
          (
            prevProducts
          ) =>
            prevProducts.filter(
              (
                product
              ) =>
                product._id !==
                productId
            )
        );

        toast.success(
          "Product deleted successfully"
        );
      } catch (error) {
        console.log(error);

        toast.error(
          error?.response
            ?.data
            ?.message ||
            "Failed to delete product"
        );
      } finally {
        setDeleting(
          null
        );
      }
    };

  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        Manage Products
      </h1>

      {products.length ===
      0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">
            No Products Found
          </h2>

          <p className="text-gray-500 mt-2">
            Add your first
            product to get
            started.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(
            (
              product
            ) => (
              <div
                key={
                  product._id
                }
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <img
                  src={
                    product
                      ?.images?.[0] ||
                    "https://via.placeholder.com/400"
                  }
                  alt={
                    product.title
                  }
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h2 className="font-bold text-lg line-clamp-2">
                    {
                      product.title
                    }
                  </h2>

                  <p className="text-gray-600 mt-1">
                    {
                      product.brand
                    }
                  </p>

                  <div className="mt-3">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {
                        product.category
                      }
                    </span>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/edit-product/${product._id}`
                        )
                      }
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          product._id
                        )
                      }
                      disabled={
                        deleting ===
                        product._id
                      }
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {deleting ===
                      product._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;