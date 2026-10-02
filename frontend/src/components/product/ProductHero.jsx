import { useState } from "react";
import { motion } from "motion/react";
import {
  Heart,
  Scale,
  Bell,
  Share2,
  Check,
  Info,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCompare } from "../../features/compare/CompareContext";
import PriceTag from "../ui/PriceTag";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Tooltip from "../ui/Tooltip";
import RangeBar from "../ui/RangeBar";
import Rating from "../ui/Rating";

const ProductHero = ({
  product,
  activeImage = 0,
  setActiveImage,
  lowestPrice,
  highestPrice,
  marketAverage = 0,
  userInfo: _userInfo,
  isWishlisted,
  wishlistLoading,
  toggleWishlist,
  lastUpdated,
  onOpenAlertModal,
  bestListingUrl,
}) => {
  const { compareItems, addToCompare, removeFromCompare } = useCompare();
  const [copied, setCopied] = useState(false);

  const isCompared = compareItems.some((p) => p._id === product._id);

  const handleCompareToggle = () => {
    if (isCompared) {
      removeFromCompare(product._id);
      toast("Removed from comparison", { icon: "⚖️" });
    } else {
      if (compareItems.length >= 4) {
        toast.error("Maximum 4 products in comparison");
        return;
      }
      addToCompare(product);
      toast.success("Added to comparison");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} - PriceLens`,
          text: `Check out live price comparison for ${product.title} on PriceLens`,
          url,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Product link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  // Derive Price Verdict (Client-side price trend calculation)
  const priceVerdict = (() => {
    if (!lowestPrice || !marketAverage) return null;
    const diff = ((lowestPrice - marketAverage) / marketAverage) * 100;
    if (diff <= -6) {
      return {
        label: "Good time to buy",
        variant: "signal",
        hint: `Currently ${Math.abs(Math.round(diff))}% below market average across indexed sellers.`,
      };
    }
    if (diff <= 3) {
      return {
        label: "Fair price",
        variant: "neutral",
        hint: "Current listing aligns within normal market trading range.",
      };
    }
    return {
      label: "Better to wait",
      variant: "rise",
      hint: "Price is elevated compared to historical averages. Consider setting an alert.",
    };
  })();

  const images = product?.images?.length
    ? product.images
    : ["https://via.placeholder.com/600"];

  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Gallery (6 cols) */}
      <div className="lg:col-span-6 space-y-4">
        {/* Main Image Frame with Ambient Glow */}
        <div className="relative w-full aspect-square max-h-[500px] bg-surface-2/30 border border-line rounded-lg p-6 sm:p-10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-radial from-line/40 via-transparent to-transparent pointer-events-none" />

          <motion.img
            key={activeImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            src={images[activeImage]}
            alt={product.title}
            className="w-full h-full object-contain max-h-[420px] transition-transform duration-300 hover:scale-[1.03]"
          />

          {lowestPrice && (
            <div className="absolute top-4 left-4">
              <Badge variant="signal" size="sm">
                Verified Deals
              </Badge>
            </div>
          )}
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 rounded-md border p-1 bg-surface-2/40 shrink-0 transition-all cursor-pointer ${
                  activeImage === idx
                    ? "border-signal ring-1 ring-signal/50"
                    : "border-line opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Sticky Buy-Box (6 cols) */}
      <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-24">
        {/* Title, Brand, Category, Rating */}
        <div className="space-y-2 border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted">
              {product.brand || "Hardware Device"}
            </span>
            <span className="text-muted">·</span>
            <span className="text-xs font-mono text-signal uppercase">
              {product.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text leading-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 pt-1">
            <Rating rating={product.overallRating || 4.5} count={12} size="sm" />
            {lastUpdated && (
              <span className="text-[11px] font-mono text-muted">
                Synced {new Date(lastUpdated).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Hero Price & Verdict Strip */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                Lowest Current Index
              </span>
              <PriceTag price={lowestPrice} size="hero" highlight />
            </div>

            {/* Price Verdict Chip */}
            {priceVerdict && (
              <Tooltip
                content={
                  <div>
                    <p className="font-semibold">{priceVerdict.hint}</p>
                    <p className="text-[10px] text-muted mt-1">
                      Based on this product's price history. Not financial advice.
                    </p>
                  </div>
                }
              >
                <Badge variant={priceVerdict.variant} size="lg">
                  <span className="cursor-help flex items-center gap-1">
                    {priceVerdict.label} <Info className="w-3.5 h-3.5" />
                  </span>
                </Badge>
              </Tooltip>
            )}
          </div>

          {/* RangeBar (Low - Avg - High - Current) */}
          {lowestPrice && highestPrice && highestPrice > lowestPrice && (
            <div className="pt-2">
              <RangeBar
                low={lowestPrice}
                avg={marketAverage}
                high={highestPrice}
                current={lowestPrice}
              />
            </div>
          )}
        </div>

        {/* Primary CTA & Secondary Action Grid */}
        <div className="space-y-3 pt-2">
          {bestListingUrl ? (
            <a
              href={bestListingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button variant="signal" size="lg" className="w-full">
                <span>Go to Best Deal</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </a>
          ) : (
            <Button
              variant="signal"
              size="lg"
              className="w-full"
              onClick={() => {
                const el = document.getElementById("sellers-matrix");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Available Listings
            </Button>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Set Price Alert */}
            <Button
              variant="outline"
              size="sm"
              icon={Bell}
              onClick={onOpenAlertModal}
              className="text-xs"
            >
              Price Alert
            </Button>

            {/* Wishlist */}
            <Button
              variant={isWishlisted ? "secondary" : "outline"}
              size="sm"
              icon={Heart}
              loading={wishlistLoading}
              onClick={toggleWishlist}
              className={`text-xs ${isWishlisted ? "text-rose-500 font-semibold" : ""}`}
            >
              {isWishlisted ? "Saved" : "Wishlist"}
            </Button>

            {/* Compare */}
            <Button
              variant={isCompared ? "secondary" : "outline"}
              size="sm"
              icon={isCompared ? Check : Scale}
              onClick={handleCompareToggle}
              className={`text-xs ${isCompared ? "text-signal font-semibold" : ""}`}
            >
              {isCompared ? "Compared" : "Compare"}
            </Button>

            {/* Share */}
            <Button
              variant="outline"
              size="sm"
              icon={copied ? Check : Share2}
              onClick={handleShare}
              className="text-xs"
            >
              {copied ? "Copied" : "Share"}
            </Button>
          </div>
        </div>

        {/* Short description preview */}
        {product.description && (
          <div className="pt-4 border-t border-line text-xs text-muted leading-relaxed">
            <p className="line-clamp-3">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductHero;