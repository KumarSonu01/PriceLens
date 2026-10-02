import { useState } from "react";
import { ExternalLink, Check, X, ArrowUpDown, Award } from "lucide-react";
import PlatformBadge from "../ui/PlatformBadge";
import PriceTag from "../ui/PriceTag";

const ComparisonTable = ({ listings = [], marketAverage = 0, bestListingId }) => {
  const [sortAsc, setSortAsc] = useState(true);

  if (!listings || listings.length === 0) {
    return null;
  }

  const sortedListings = [...listings].sort((a, b) => {
    return sortAsc ? a.price - b.price : b.price - a.price;
  });

  return (
    <div className="w-full bg-surface border border-line rounded-lg overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-2/30">
        <div>
          <h2 className="text-lg font-bold text-text tracking-tight flex items-center gap-2">
            <span>Ranked Merchant Matrix</span>
            <span className="text-xs font-mono text-muted bg-surface-2 px-2 py-0.5 rounded border border-line">
              {listings.length} Offers
            </span>
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Real-time verified marketplace & local storefront stock
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSortAsc((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-line bg-surface text-xs font-mono text-muted hover:text-text cursor-pointer transition-colors"
        >
          <ArrowUpDown className="w-3 h-3" />
          <span>Sort by Price: {sortAsc ? "Low → High" : "High → Low"}</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-surface-2 text-[11px] font-mono uppercase tracking-wider text-muted border-b border-line">
            <tr>
              <th className="py-3 px-4">Merchant / Channel</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Indexed Price</th>
              <th className="py-3 px-4">Fulfillment</th>
              <th className="py-3 px-4">Availability</th>
              <th className="py-3 px-4 text-right">Destination</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sortedListings.map((listing) => {
              const isBest = listing._id === bestListingId;
              const storeUrl = listing.isScraped
                ? listing.productUrl
                : listing?.seller?.storeLink;

              const sellerName =
                listing?.seller?.shopName ||
                listing?.seller?.name ||
                listing.source ||
                "Verified Seller";

              return (
                <tr
                  key={listing._id}
                  className={`transition-colors ${
                    isBest
                      ? "bg-signal/5 hover:bg-signal/10"
                      : "hover:bg-surface-2/50"
                  }`}
                >
                  {/* Seller / Platform */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <PlatformBadge source={listing.source} size="sm" />
                      <div className="min-w-0">
                        <p className="font-semibold text-text text-xs sm:text-sm truncate">
                          {sellerName}
                        </p>
                        {isBest && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-signal font-bold uppercase tracking-tight">
                            <Award className="w-3 h-3" /> Best Deal
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Channel Type */}
                  <td className="py-3.5 px-4 text-xs font-mono text-muted">
                    {listing.isScraped ? "Marketplace" : "Local Retailer"}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-mono">
                    <PriceTag
                      price={listing.price}
                      size="sm"
                      highlight={isBest}
                    />
                  </td>

                  {/* Delivery */}
                  <td className="py-3.5 px-4 text-xs text-text">
                    <span>{listing.deliveryInfo || "Standard delivery"}</span>
                    {listing.offer && listing.offer !== "NA" && (
                      <span className="block text-[10px] text-signal font-mono mt-0.5">
                        +{listing.offer}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3.5 px-4">
                    {listing.stock ? (
                      <span className="inline-flex items-center gap-1 text-xs text-drop font-medium">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" /> In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-rise font-medium">
                        <X className="w-3.5 h-3.5 stroke-[2.5]" /> Out of Stock
                      </span>
                    )}
                  </td>

                  {/* Outbound Link */}
                  <td className="py-3.5 px-4 text-right">
                    {storeUrl ? (
                      <a
                        href={storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded bg-surface-2 hover:bg-signal hover:text-black border border-line text-text transition-colors"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-muted font-mono">
                        Direct store
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3.5 bg-surface-2/40 border-t border-line text-xs font-mono text-muted flex items-center justify-between">
        <span>Total Sellers Indexed: {listings.length}</span>
        {marketAverage > 0 && (
          <span>Market Avg: ₹{marketAverage.toLocaleString("en-IN")}</span>
        )}
      </div>
    </div>
  );
};

export default ComparisonTable;