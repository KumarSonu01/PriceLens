import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import api from "../api/axios";

import ProductCard from "../components/product/ProductCard";

const SearchPage = () => {
  const location =
    useLocation();

  const searchParams =
    new URLSearchParams(
      location.search
    );

  const keyword =
    searchParams.get(
      "keyword"
    ) || "";

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);

          const { data } =
            await api.get(
              `/products?keyword=${keyword}`
            );

          setProducts(
            data.products
          );
        } catch (error) {
          console.log(error);

          setError(
            "Failed to search products"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, [keyword]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Searching...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Search Results
        </h1>

        <p className="text-gray-600 mt-3">
          Showing results for:
          <span className="font-semibold">
            {" "}
            {keyword}
          </span>
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <h2 className="text-2xl font-bold">
            No Products Found
          </h2>

          <p className="text-gray-500 mt-3">
            Try searching with a
            different keyword.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(
            (product) => (
              <ProductCard
                key={
                  product._id
                }
                product={
                  product
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;