import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../api/axios";

import ListingCard from "../components/listing/ListingCard";

import PriceHistoryChart from "../components/product/PriceHistoryChart";

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  const [listings, setListings] =
    useState([]);

  const [priceHistory, setPriceHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    activeImage,
    setActiveImage,
  ] = useState(0);

  const lowestPrice =
    listings.length > 0
      ? Math.min(
          ...listings.map(
            (listing) =>
              listing.price
          )
        )
      : null;

  const highestPrice =
    listings.length > 0
      ? Math.max(
          ...listings.map(
            (listing) =>
              listing.price
          )
        )
      : null;

  const marketAverage =
    listings.length > 0
      ? Math.round(
          listings.reduce(
            (acc, listing) =>
              acc +
              listing.price,
            0
          ) / listings.length
        )
      : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          productResponse,
          listingsResponse,
          historyResponse,
        ] = await Promise.all([
          api.get(`/products/${id}`),

          api.get(
            `/listings/product/${id}`
          ),

          api.get(
            `/products/${id}/price-history`
          ),
        ]);

        setProduct(
          productResponse.data
        );

        setListings(
          listingsResponse.data
        );

        setPriceHistory(
          historyResponse.data
        );
      } catch (error) {
        console.log(error);

        setError(
          "Failed to load product details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Loading Product...
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Product not found
      </div>
    );
  }

  const sortedListings =
    [...listings].sort(
      (a, b) =>
        a.price - b.price
    );

  const bestListingId =
    sortedListings[0]?._id;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
        <div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-center">
              <img
                src={
                  product?.images?.[
                    activeImage
                  ] ||
                  "https://via.placeholder.com/500"
                }
                alt={
                  product.title
                }
                className="w-full h-[280px] sm:h-[380px] object-contain"
                onError={(
                  e
                ) => {
                  e.target.src =
                    "https://via.placeholder.com/500";
                }}
              />
            </div>

            {product?.images
              ?.length > 1 && (
              <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
                {product.images.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={index}
                      onClick={() =>
                        setActiveImage(
                          index
                        )
                      }
                      className={`border rounded-xl p-2 min-w-[80px] h-[80px] flex items-center justify-center transition ${
                        activeImage ===
                        index
                          ? "border-black"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            {product.title}
          </h1>

          <p className="text-xl text-gray-600 mt-4">
            {product.brand}
          </p>

          <p className="text-gray-700 mt-6 leading-relaxed max-w-2xl">
            {
              product.description
            }
          </p>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-5">
              Specifications
            </h2>

            <div className="space-y-4">
              {product.specifications &&
              Object.keys(
                product.specifications
              ).length > 0 ? (
                Object.entries(
                  product.specifications
                ).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-5 border-b border-gray-200 pb-3"
                    >
                      <span className="font-semibold capitalize">
                        {key}
                      </span>

                      <span className="text-right text-gray-700">
                        {value}
                      </span>
                    </div>
                  )
                )
              ) : (
                <p className="text-gray-500">
                  No specifications available
                </p>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-5">
              Features
            </h2>

            <div className="flex flex-wrap gap-3">
              {product?.features
                ?.length > 0 ? (
                product.features.map(
                  (
                    feature,
                    index
                  ) => (
                    <div
                      key={index}
                      className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </div>
                  )
                )
              ) : (
                <p className="text-gray-500">
                  No features available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Compare Prices
          </h2>

          <div className="flex flex-wrap gap-4 mt-4">
            {lowestPrice && (
              <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                Best Price: ₹
                {lowestPrice.toLocaleString()}
              </div>
            )}

            {marketAverage >
              0 && (
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
                Market Avg: ₹
                {marketAverage.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {listings.length ===
        0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <h3 className="text-2xl font-bold">
              No Listings Found
            </h3>

            <p className="text-gray-500 mt-3">
              Sellers have not
              added listings for
              this product yet.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-5 ${
              listings.length ===
              1
                ? "grid-cols-1 max-w-2xl"
                : "grid-cols-1 lg:grid-cols-2"
            }`}
          >
            {listings.map(
              (listing) => (
                <ListingCard
                  key={
                    listing._id
                  }
                  listing={
                    listing
                  }
                  isBestDeal={
                    listing._id ===
                    bestListingId
                  }
                  savings={
                    highestPrice -
                    listing.price
                  }
                  marketAverage={
                    marketAverage
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      <div className="mt-16">
        <PriceHistoryChart
          data={priceHistory}
        />
      </div>
    </div>
  );
};

export default ProductPage;