import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import api from "../api/axios";

import ProductCard from "../components/product/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);

  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(
          `/products?keyword=${keyword}`
        );

        setProducts(data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [keyword]);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-10">
        PriceLens Products
      </h1>

      <div className="grid grid-cols-3 gap-5">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;