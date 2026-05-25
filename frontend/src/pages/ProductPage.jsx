import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../api/axios";

import ListingCard from "../components/listing/ListingCard";

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [listings, setListings] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const lowestPrice = Math.min(
    ...listings.map((listing) => listing.price)
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(
          `/products/${id}`
        );

        setProduct(data);
      } catch (error) {
        setError(
          "Failed to load product details"
        );
      }
    };

    const fetchListings = async () => {
      try {
        const { data } = await api.get(
          `/listings/product/${id}`
        );

        setListings(data);
      } catch (error) {
        setError(
          "Failed to load listings"
        );
      }
    };

    const fetchData = async () => {
      setLoading(true);

      await fetchProduct();

      await fetchListings();

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-10 text-2xl">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-10 text-2xl text-red-600">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen p-10 text-2xl">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10 min-h-screen">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <img
            src={
              product.images[0] ||
              "https://via.placeholder.com/500"
            }
            alt={product.title}
            className="w-full h-[500px] object-cover rounded-lg"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/500";
            }}
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold">
            {product.title}
          </h1>

          <p className="text-xl text-gray-600 mt-4">
            {product.brand}
          </p>

          <p className="text-lg mt-4">
            {product.description}
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Specifications
            </h2>

            {Object.entries(
              product.specifications
            ).map(([key, value]) => (
              <div
                key={key}
                className="flex gap-4 mb-2"
              >
                <span className="font-bold">
                  {key}:
                </span>

                <span>{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Features
            </h2>

            <div className="flex flex-wrap gap-3">
              {product.features.map(
                (feature, index) => (
                  <div
                    key={index}
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    {feature}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">
          Compare Prices
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              isBestDeal={
                listing.price === lowestPrice
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;