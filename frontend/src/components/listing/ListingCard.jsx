import {
  FaAmazon,
  FaStore,
} from "react-icons/fa";

import { MdLocalShipping } from "react-icons/md";

const ListingCard = ({
  listing,
  isBestDeal,
  savings,
  marketAverage,
}) => {
  const sourceConfig = {
    amazon: {
      name: "Amazon",

      icon: FaAmazon,

      bg: "bg-orange-100",

      text: "text-orange-700",

      border:
        "border-orange-200",
    },

    flipkart: {
      name: "Flipkart",

      icon: FaStore,

      bg: "bg-blue-100",

      text: "text-blue-700",

      border:
        "border-blue-200",
    },

    blinkit: {
      name: "Blinkit",

      icon: FaStore,

      bg: "bg-yellow-100",

      text: "text-yellow-700",

      border:
        "border-yellow-200",
    },

    zepto: {
      name: "Zepto",

      icon: FaStore,

      bg: "bg-pink-100",

      text: "text-pink-700",

      border:
        "border-pink-200",
    },

    local: {
      name: "Local Store",

      icon: FaStore,

      bg: "bg-gray-100",

      text: "text-gray-700",

      border:
        "border-gray-200",
    },
  };

  const currentSource =
    sourceConfig[
      listing.source
    ] ||
    sourceConfig.local;

  const SourceIcon =
    currentSource.icon;

  const priceDifference =
    marketAverage -
    listing.price;

  const isHugeDeal =
    priceDifference > 2000;

  return (
    <div
      className={`bg-white rounded-2xl shadow-md border p-6 transition duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col ${
        isBestDeal
          ? "border-green-500 ring-2 ring-green-100"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${currentSource.bg} ${currentSource.text} ${currentSource.border}`}
          >
            <SourceIcon />

            {
              currentSource.name
            }
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <FaStore />

            <span>
              {listing?.seller
                ? "Verified Seller"
                : "Marketplace"}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-green-600">
            ₹
            {listing.price.toLocaleString()}
          </p>

          {isBestDeal && (
            <div className="mt-2 inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Best Deal
            </div>
          )}

          {isBestDeal &&
            savings > 0 && (
              <div className="mt-2 text-sm text-green-700 font-medium">
                Save ₹
                {savings.toLocaleString()}
              </div>
            )}
        </div>
      </div>

      <div className="mt-8 space-y-5 flex-grow">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-gray-600">
            <MdLocalShipping />

            <span>
              Delivery
            </span>
          </div>

          <span className="font-medium text-right">
            {listing.deliveryInfo ||
              "No delivery info"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-5">
          <span className="text-gray-600">
            Availability
          </span>

          <span
            className={`font-semibold ${
              listing.stock
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {listing.stock
              ? "In Stock"
              : "Out of Stock"}
          </span>
        </div>
      </div>

      {isHugeDeal && (
        <div className="mt-6">
          <div className="inline-flex bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold">
            🔥 ₹
            {Math.round(
              priceDifference
            ).toLocaleString()}{" "}
            Cheaper Than Market
          </div>
        </div>
      )}

      {listing.offer &&
        listing.offer !== "NA" && (
          <div className="mt-4">
            <div className="inline-flex bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
              🎉 {listing.offer}
            </div>
          </div>
        )}

      {listing.productUrl ? (
        <a
          href={
            listing.productUrl
          }
          target="_blank"
          rel="noreferrer"
          className="w-full mt-8 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition text-center font-semibold"
        >
          Visit Store →
        </a>
      ) : (
        <button
          disabled
          className="w-full mt-8 bg-gray-300 text-gray-600 py-3 rounded-xl cursor-not-allowed font-semibold"
        >
          Store Link Unavailable
        </button>
      )}
    </div>
  );
};

export default ListingCard;