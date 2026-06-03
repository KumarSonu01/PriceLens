import { FaHeart } from "react-icons/fa";

const ProductHero = ({
  product,
  activeImage,
  setActiveImage,
  lowestPrice,
  marketAverage,
  userInfo,
  isWishlisted,
  wishlistLoading,
  toggleWishlist,
  lastUpdated,
}) => {
  return (
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
              alt={product.title}
              className="w-full h-[280px] sm:h-[380px] object-contain"
              onError={(e) => {
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

        <div className="flex flex-wrap gap-4 mt-6">
          {lowestPrice && (
            <div className="bg-green-100 text-green-700 px-5 py-3 rounded-xl font-bold">
              Best Price: ₹
              {lowestPrice.toLocaleString()}
            </div>
          )}

          {marketAverage >
            0 && (
            <div className="bg-blue-100 text-blue-700 px-5 py-3 rounded-xl font-bold">
              Avg: ₹
              {marketAverage.toLocaleString()}
            </div>
          )}
        </div>

        {lastUpdated && (
          <div className="mt-4 text-sm text-gray-500">
            Last Updated:{" "}
            {new Date(
              lastUpdated
            ).toLocaleString()}
          </div>
        )}

        {userInfo && (
          <button
            onClick={
              toggleWishlist
            }
            disabled={
              wishlistLoading
            }
            className={`mt-6 flex items-center gap-3 transition text-white px-6 py-3 rounded-xl font-semibold ${
              isWishlisted
                ? "bg-pink-600 hover:bg-pink-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            <FaHeart />

            {wishlistLoading
              ? "Saving..."
              : isWishlisted
              ? "Wishlisted"
              : "Add To Wishlist"}
          </button>
        )}

        <p className="text-gray-700 mt-8 leading-relaxed max-w-2xl">
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default ProductHero;