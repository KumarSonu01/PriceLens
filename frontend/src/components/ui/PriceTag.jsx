import { cn } from "../../lib/utils";

const PriceTag = ({
  price,
  originalPrice,
  currency = "₹",
  size = "md",
  className,
  highlight = false,
}) => {
  if (price === null || price === undefined) {
    return (
      <span className={cn("text-xs font-mono text-muted", className)}>
        No Price
      </span>
    );
  }

  const sizes = {
    xs: "text-sm",
    sm: "text-base font-semibold",
    md: "text-xl font-bold",
    lg: "text-2xl sm:text-3xl font-extrabold",
    hero: "text-4xl sm:text-5xl font-black",
  };

  const formattedPrice =
    typeof price === "number" ? price.toLocaleString("en-IN") : price;
  const formattedOriginal =
    typeof originalPrice === "number"
      ? originalPrice.toLocaleString("en-IN")
      : originalPrice;

  return (
    <div className={cn("inline-flex items-baseline gap-2 flex-wrap", className)}>
      <span
        className={cn(
          "font-mono tracking-tight tabular-nums",
          sizes[size],
          highlight ? "text-signal" : "text-text"
        )}
      >
        <span className="font-sans mr-0.5 text-xs font-normal opacity-70">
          {currency}
        </span>
        {formattedPrice}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-xs font-mono text-muted line-through tabular-nums">
          {currency}
          {formattedOriginal}
        </span>
      )}
    </div>
  );
};

export default PriceTag;
