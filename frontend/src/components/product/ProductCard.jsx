import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
        <img
          src={
            product.images[0] ||
            "https://via.placeholder.com/300"
          }
          alt={product.title}
          className="w-full h-52 object-cover rounded"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300";
          }}
        />

        <h2 className="text-xl font-bold mt-4">
          {product.title}
        </h2>

        <p className="text-gray-600">
          {product.brand}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          {product.category}
        </p>

        {product.lowestPrice && (
          <div className="mt-4">
            <span className="text-gray-500 text-sm">
              Starting From
            </span>

            <div className="text-2xl font-bold text-green-600">
              ₹{product.lowestPrice}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;