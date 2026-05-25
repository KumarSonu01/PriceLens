import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import api from "../api/axios";

import ProductCard from "../components/product/ProductCard";

import ProductSkeleton from "../components/product/ProductSkeleton";

const Home = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [totalPages, setTotalPages] =
    useState(1);

  const [searchParams, setSearchParams] =
    useSearchParams();

  const keyword =
    searchParams.get("keyword") || "";

  const sort =
    searchParams.get("sort") || "";

  const category =
    searchParams.get("category") || "";

  const page =
    Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        setError("");

        const { data } = await api.get(
          `/products?keyword=${keyword}&sort=${sort}&category=${category}&page=${page}&limit=6`
        );

        setProducts(data.products);

        setTotalPages(data.totalPages);
      } catch (error) {
        setError(
          "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, sort, category, page]);

  const updateSearchParams = (
    newParams
  ) => {
    const params = {};

    if (keyword) {
      params.keyword = keyword;
    }

    if (sort) {
      params.sort = sort;
    }

    if (category) {
      params.category = category;
    }

    if (page) {
      params.page = page;
    }

    Object.assign(params, newParams);

    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    updateSearchParams({
      sort: e.target.value,
      page: 1,
    });
  };

  const handleCategoryChange = (e) => {
    updateSearchParams({
      category: e.target.value,
      page: 1,
    });
  };

  const handlePageChange = (
    newPage
  ) => {
    updateSearchParams({
      page: newPage,
    });
  };

  if (error) {
    return (
      <div className="min-h-screen p-10 text-2xl text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-10">
        <h1 className="text-4xl font-bold">
          PriceLens Products
        </h1>

        <div className="flex flex-wrap gap-4">
          <select
            value={sort}
            onChange={handleSortChange}
            className="border px-4 py-2 rounded"
          >
            <option value="">
              Sort Products
            </option>

            <option value="latest">
              Latest
            </option>

            <option value="rating">
              Highest Rated
            </option>

            <option value="priceLow">
              Price: Low to High
            </option>

            <option value="priceHigh">
              Price: High to Low
            </option>
          </select>

          <select
            value={category}
            onChange={handleCategoryChange}
            className="border px-4 py-2 rounded"
          >
            <option value="">
              All Categories
            </option>

            <option value="Mobiles">
              Mobiles
            </option>

            <option value="Laptops">
              Laptops
            </option>

            <option value="Headphones">
              Headphones
            </option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, index) => (
            <ProductSkeleton
              key={index}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-2xl text-gray-500">
          No products found.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-10">
            {[...Array(totalPages)].map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handlePageChange(
                      index + 1
                    )
                  }
                  className={`px-4 py-2 rounded ${
                    page === index + 1
                      ? "bg-black text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;