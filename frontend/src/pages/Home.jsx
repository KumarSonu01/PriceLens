import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import api from "../api/axios";

import ProductCard from "../components/product/ProductCard";

import ProductSkeleton from "../components/product/ProductSkeleton";

const Home = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [totalPages, setTotalPages] =
    useState(1);

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const keyword =
    searchParams.get("keyword") ||
    "";

  const sort =
    searchParams.get("sort") || "";

  const category =
    searchParams.get(
      "category"
    ) || "";

  const page =
    Number(
      searchParams.get("page")
    ) || 1;

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);

          setError("");

          const { data } =
            await api.get(
              `/products?keyword=${keyword}&sort=${sort}&category=${category}&page=${page}&limit=6`
            );

          setProducts(
            data.products
          );

          setTotalPages(
            data.totalPages
          );
        } catch (error) {
          setError(
            "Failed to load products"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, [
    keyword,
    sort,
    category,
    page,
  ]);

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

    Object.assign(
      params,
      newParams
    );

    setSearchParams(params);
  };

  const handleSortChange = (
    e
  ) => {
    updateSearchParams({
      sort: e.target.value,
      page: 1,
    });
  };

  const handleCategoryChange = (
    e
  ) => {
    updateSearchParams({
      category:
        e.target.value,
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
    <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-10">
        <h1 className="text-4xl font-bold">
          PriceLens Products
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <select
            value={sort}
            onChange={
              handleSortChange
            }
            className="border px-4 py-2 rounded w-full sm:w-auto"
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
            onChange={
              handleCategoryChange
            }
            className="border px-4 py-2 rounded w-full sm:w-auto"
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

      {(keyword ||
        sort ||
        category) && (
        <div className="flex flex-wrap gap-3 mb-8">
          {keyword && (
            <div className="bg-black text-white px-4 py-2 rounded-full text-sm">
              Search:
              <span className="font-semibold ml-1">
                {keyword}
              </span>
            </div>
          )}

          {sort && (
            <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm">
              Sort:
              <span className="font-semibold ml-1">
                {sort}
              </span>
            </div>
          )}

          {category && (
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
              Category:
              <span className="font-semibold ml-1">
                {category}
              </span>
            </div>
          )}

          <button
            onClick={() =>
              setSearchParams({})
            }
            className="bg-red-600 text-white px-4 py-2 rounded-full text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map(
            (_, index) => (
              <ProductSkeleton
                key={index}
              />
            )
          )}
        </div>
      ) : products.length ===
        0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Products Found
          </h2>

          <p className="text-gray-500 mt-3">
            Try changing your
            filters or search
            keyword.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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

          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              ...Array(
                totalPages
              ),
            ].map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  handlePageChange(
                    index + 1
                  )
                }
                className={`px-4 py-2 rounded ${
                  page ===
                  index + 1
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;