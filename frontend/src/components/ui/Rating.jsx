import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

const Rating = ({ rating = 0, count, size = "sm", className }) => {
  const numRating = typeof rating === "number" ? rating : parseFloat(rating) || 0;

  const starSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5 text-warn">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSizes[size],
              star <= Math.round(numRating)
                ? "fill-warn text-warn"
                : "text-line fill-transparent"
            )}
          />
        ))}
      </div>
      <span className="font-mono text-xs font-semibold text-text tabular-nums">
        {numRating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs text-muted">({count.toLocaleString()})</span>
      )}
    </div>
  );
};

export default Rating;
