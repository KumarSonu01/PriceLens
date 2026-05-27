import { Link } from "react-router-dom";

const ProductCard = ({
  product,
}) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="h-full"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
        <div className="relative">
          <div className="h-72 bg-gray-50 flex items-center justify-center overflow-hidden">
            <img
              src={
                product?.images?.[0] ||
                "https://via.placeholder.com/300"
              }
              alt={product.title}
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300";
              }}
            />
          </div>

          {product.lowestPrice && (
            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
              Best Price
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-bold line-clamp-2 min-h-[64px] break-words">
                {product.title}
              </h2>

              <p className="text-gray-600 mt-1">
                {product.brand}
              </p>
            </div>

            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap shrink-0">
              {
                product.category
              }
            </div>
          </div>

          <div className="mt-auto pt-5">
            {product.lowestPrice ? (
              <>
                <p className="text-sm text-gray-500">
                  Starting From
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
                  <h3 className="text-3xl font-bold text-green-600 break-all">
                    ₹
                    {
                      product.lowestPrice
                    }
                  </h3>

                  <div className="text-sm text-gray-500 font-medium">
                    Compare Prices →
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg text-sm font-medium">
                No listings available
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;