import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../api/axios";

import ListingCard from "../components/listing/ListingCard";

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);

        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchListings = async () => {
      try {
        const { data } = await api.get(
          `/listings/product/${id}`
        );

        setListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();

    fetchListings();
  }, [id]);

  if (!product) {
    return (
      <div className="p-10 text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="grid grid-cols-2 gap-10">
        <div>
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full rounded-lg"
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

            {Object.entries(product.specifications).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="flex gap-4 mb-2"
                >
                  <span className="font-bold">
                    {key}:
                  </span>

                  <span>{value}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">
          Compare Prices
        </h2>

        <div className="grid grid-cols-2 gap-5">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;