import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  FaSearch,
  FaStore,
  FaTags,
  FaBolt,
} from "react-icons/fa";

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

  const [
    searchInput,
    setSearchInput,
  ] = useState(keyword);

  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

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

    Object.keys(params).forEach(
      (key) => {
        if (
          params[key] === "" ||
          params[key] === null
        ) {
          delete params[key];
        }
      }
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

  const handleCategoryChange =
    (selectedCategory) => {
      updateSearchParams({
        category:
          selectedCategory,
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

  const searchHandler = (
    e
  ) => {
    e.preventDefault();

    updateSearchParams({
      keyword: searchInput,
      page: 1,
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
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-black to-black" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur px-5 py-2 rounded-full text-sm font-medium mb-8">
            <FaBolt />

            Smart Price
            Intelligence
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl mx-auto">
            Compare Prices
            Across Online &
            Local Stores
          </h1>

          <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover better
            deals, track price
            drops, compare
            sellers, and shop
            smarter with
            real-time pricing
            intelligence.
          </p>

          <form
            onSubmit={
              searchHandler
            }
            className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl p-3 shadow-2xl flex flex-col md:flex-row gap-3"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) =>
                setSearchInput(
                  e.target.value
                )
              }
              placeholder="Search mobiles, laptops, headphones..."
              className="flex-1 px-5 py-4 text-black rounded-xl outline-none text-lg"
            />

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 transition text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <FaSearch />

              Search
            </button>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">
            <div className="bg-white/10 border border-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-3xl font-bold">
                10K+
              </h3>

              <p className="text-gray-300 mt-2">
                Products
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-3xl font-bold">
                500+
              </h3>

              <p className="text-gray-300 mt-2">
                Sellers
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-3xl font-bold">
                Live
              </h3>

              <p className="text-gray-300 mt-2">
                Price Tracking
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-3xl font-bold">
                Local
              </h3>

              <p className="text-gray-300 mt-2">
                Store Support
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-extrabold">
              Explore Categories
            </h2>

            <p className="text-gray-500 mt-3">
              Browse products by
              category
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            "Mobiles",
            "Laptops",
            "Headphones",
            "Appliances",
          ].map((item) => (
            <button
              key={item}
              onClick={() =>
                handleCategoryChange(
                  item
                )
              }
              className="bg-white hover:bg-black hover:text-white transition rounded-2xl shadow p-8 text-center border"
            >
              <FaTags className="mx-auto text-3xl mb-4" />

              <h3 className="text-xl font-bold">
                {item}
              </h3>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-gradient-to-r from-green-600 to-black rounded-3xl p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-5">
              <FaStore />

              Local Commerce
            </div>

            <h2 className="text-4xl font-extrabold max-w-2xl leading-tight">
              Discover Nearby
              Deals From Local
              Shops
            </h2>

            <p className="text-gray-200 mt-5 text-lg max-w-2xl">
              Compare local
              store pricing with
              online marketplaces
              and shop smarter in
              your city.
            </p>
          </div>

          <button className="bg-white text-black hover:bg-gray-200 transition px-8 py-4 rounded-2xl font-bold text-lg">
            Explore Local
            Sellers
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-10">
          <div>
            <h2 className="text-4xl font-extrabold">
              Featured Deals
            </h2>

            <p className="text-gray-500 mt-3">
              Curated products
              with competitive
              pricing
            </p>
          </div>

          <select
            value={sort}
            onChange={
              handleSortChange
            }
            className="border px-4 py-3 rounded-xl bg-white"
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

            <div className="flex flex-wrap justify-center gap-3 mt-12">
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
                  className={`px-5 py-3 rounded-xl font-semibold ${
                    page ===
                    index + 1
                      ? "bg-black text-white"
                      : "bg-white border"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;