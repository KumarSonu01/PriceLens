import { ExternalLink, Truck, Tag, Store, Check, X } from "lucide-react";
import Card from "../ui/Card";
import PlatformBadge from "../ui/PlatformBadge";
import PriceTag from "../ui/PriceTag";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const ListingCard = ({
  listing,
  isBestDeal = false,
  savings = 0,
  marketAverage = 0,
}) => {
  const storeUrl = listing.isScraped
    ? listing.productUrl
    : listing?.seller?.storeLink;

  const sellerName =
    listing?.seller?.shopName ||
    listing?.seller?.name ||
    listing.source ||
    "Verified Merchant";

  const priceDiff = marketAverage ? marketAverage - listing.price : 0;
  const isSignificantlyCheaper = priceDiff > 1000;

  return (
    <Card
      hoverable
      className={`p-5 flex flex-col justify-between h-full transition-all ${
        isBestDeal ? "border-signal/50 shadow-[0_0_20px_-8px_rgba(200,241,59,0.2)]" : ""
      }`}
    >
      <div>
        {/* Top Header: Badge, Seller & Lowest tag */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="space-y-1.5">
            <PlatformBadge source={listing.source} size="md" />
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium text-text truncate max-w-[180px]">
                {sellerName}
              </span>
            </div>
          </div>

          <div className="text-right">
            <PriceTag
              price={listing.price}
              size="md"
              highlight={isBestDeal}
            />
            {isBestDeal && (
              <Badge variant="signal" size="sm" className="mt-1">
                Lowest Price
              </Badge>
            )}
            {savings > 0 && isBestDeal && (
              <p className="text-[10px] font-mono text-drop mt-1">
                Save ₹{savings.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>

        {/* Fulfillment & Availability rows */}
        <div className="space-y-2 py-3 border-y border-line text-xs">
          <div className="flex items-center justify-between text-muted">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Fulfillment
            </span>
            <span className="text-text font-medium text-right truncate max-w-[180px]">
              {listing.deliveryInfo || "Standard delivery"}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted">
            <span>Availability</span>
            {listing.stock ? (
              <span className="inline-flex items-center gap-1 text-drop font-medium">
                <Check className="w-3 h-3" /> In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rise font-medium">
                <X className="w-3 h-3" /> Out of Stock
              </span>
            )}
          </div>

          {listing.offer && listing.offer !== "NA" && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="flex items-center gap-1.5 text-signal font-mono">
                <Tag className="w-3 h-3" /> Offer
              </span>
              <span className="text-text font-mono text-right text-[11px] truncate max-w-[180px]">
                {listing.offer}
              </span>
            </div>
          )}

          {isSignificantlyCheaper && (
            <p className="text-[10px] font-mono text-drop bg-drop/10 border border-drop/20 px-2 py-1 rounded text-center">
              ₹{Math.round(priceDiff).toLocaleString("en-IN")} cheaper than market average
            </p>
          )}
        </div>
      </div>

      {/* Outbound Link CTA */}
      <div className="mt-5">
        {storeUrl ? (
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant={isBestDeal ? "signal" : "secondary"}
              size="md"
              disabled={!listing.stock}
              className="w-full"
            >
              <span>{listing.stock ? "Go to Merchant" : "Out of Stock"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        ) : (
          <Button variant="outline" size="md" disabled className="w-full opacity-50">
            Physical Store Only
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ListingCard;