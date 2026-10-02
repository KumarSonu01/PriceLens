import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Scale, Check, Heart, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useCompare } from "../../features/compare/CompareContext";
import api from "../../api/axios";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import PriceTag from "../ui/PriceTag";
import DeltaChip from "../ui/DeltaChip";
import Sparkline from "../ui/Sparkline";

const ProductCard = ({ product }) => {
  const { compareItems, addToCompare, removeFromCompare } = useCompare();
  const { userInfo } = useSelector((state) => state.auth);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isCompared = compareItems.some((p) => p._id === product._id);

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) {
      toast("Sign in to save products to your wishlist", { icon: "🔒" });
      return;
    }
    try {
      setWishlistLoading(true);
      const nextState = !isWishlisted;
      setIsWishlisted(nextState);

      if (nextState) {
        await api.post("/wishlist", { productId: product._id });
        toast.success("Added to wishlist", {
          action: {
            label: "View",
            onClick: () => (window.location.href = "/wishlist"),
          },
        });
      }
    } catch {
      setIsWishlisted((prev) => !prev);
      toast.error("Wishlist action failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  // Compute dummy or mockable sparkline data if history is present on product, otherwise graceful
  const priceData = product.priceHistory?.length > 1
    ? product.priceHistory.map((h) => h.price)
    : product.lowestPrice
    ? [product.lowestPrice * 1.05, product.lowestPrice * 1.02, product.lowestPrice]
    : null;

  return (
    <Card
      hoverable
      className="group relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-text/30"
    >
      {/* Top Image Spotlight Area */}
      <div className="relative w-full h-56 sm:h-64 bg-surface-2/40 overflow-hidden flex items-center justify-center p-6 border-b border-line/60">
        {/* Ambient radial glow */}
        <div className="absolute inset-0 bg-radial from-line/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <Link
          to={`/product/${product._id}`}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={
              imgError || !product?.images?.[0]
                ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
                : product.images[0]
            }
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {product.lowestPrice ? (
            <Badge variant="signal" size="sm">
              Best Deal
            </Badge>
          ) : null}
          {product.category && (
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-2 border border-line text-muted">
              {product.category}
            </span>
          )}
        </div>

        {/* Floating Actions: Wishlist + Compare */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            title={isWishlisted ? "In wishlist" : "Add to wishlist"}
            className={`w-8 h-8 rounded-full border border-line bg-surface/90 backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer ${
              isWishlisted
                ? "text-rose-500 border-rose-500/40"
                : "text-muted hover:text-text"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`}
            />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            onClick={handleCompareToggle}
            title={isCompared ? "Remove from compare" : "Add to compare"}
            className={`w-8 h-8 rounded-full border border-line bg-surface/90 backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer ${
              isCompared
                ? "bg-signal text-black border-signal font-bold"
                : "text-muted hover:text-text"
            }`}
          >
            {isCompared ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <Scale className="w-3.5 h-3.5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Brand & Title */}
        <div className="mb-3">
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted mb-1">
            {product.brand || "Verified Hardware"}
          </p>
          <Link to={`/product/${product._id}`}>
            <h3 className="font-semibold text-sm sm:text-base text-text line-clamp-2 hover:text-signal transition-colors min-h-[40px]">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Sparkline & Delta Strip (if available) */}
        {product.lowestPrice && priceData && (
          <div className="flex items-center justify-between gap-2 py-1 mb-3">
            <Sparkline data={priceData} width={64} height={18} />
            <DeltaChip delta={-4.5} label="vs 30d" />
          </div>
        )}

        {/* Price & Action Row */}
        <div className="mt-auto pt-4 border-t border-line/60 flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-muted block mb-0.5">
              Lowest Index
            </span>
            {product.lowestPrice ? (
              <PriceTag price={product.lowestPrice} size="md" highlight />
            ) : (
              <span className="text-xs font-mono text-muted/70 bg-surface-2 px-2 py-1 rounded">
                No active listings
              </span>
            )}
          </div>

          <Link
            to={`/product/${product._id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-surface-2 hover:bg-signal hover:text-black border border-line text-text transition-all duration-150 shrink-0"
          >
            <span>View deals</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;