import { Link } from "react-router-dom";

const RelatedProducts = ({
  products,
}) => {
  if (
    !products ||
    products.length === 0
  ) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-8">
        You May Also Like
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(
          (product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group"
            >
              <div className="h-56 bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={
                    product
                      ?.images?.[0] ||
                    "https://via.placeholder.com/300"
                  }
                  alt={
                    product.title
                  }
                  className="w-full h-full object-contain group-hover:scale-105 transition"
                  onError={(
                    e
                  ) => {
                    e.target.src =
                      "https://via.placeholder.com/300";
                  }}
                />
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">
                  {
                    product.brand
                  }
                </p>

                <h3 className="font-semibold line-clamp-2 min-h-[48px]">
                  {
                    product.title
                  }
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    {product.lowestPrice ? (
                      <p className="text-green-600 font-bold">
                        ₹
                        {product.lowestPrice.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-gray-400">
                        No Price
                      </p>
                    )}
                  </div>

                  <span className="text-sm font-medium text-black">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;