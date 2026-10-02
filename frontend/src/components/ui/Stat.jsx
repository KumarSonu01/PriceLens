import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const Stat = ({
  label,
  value = 0,
  prefix = "",
  suffix = "",
  description,
  trend, // 'up' | 'down' | 'neutral'
  trendLabel,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // If reduced motion is requested or value is not a number, set directly
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;

    if (prefersReducedMotion || isNaN(numericValue)) {
      setDisplayValue(numericValue);
      return;
    }

    const duration = 800; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easedProgress * numericValue);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(numericValue);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value]);

  return (
    <div
      className={cn(
        "bg-surface border border-line rounded-lg p-5 flex flex-col justify-between",
        className
      )}
    >
      <span className="text-xs font-semibold tracking-wide uppercase text-muted">
        {label}
      </span>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-text tabular-nums">
          {prefix}
          {displayValue.toLocaleString()}
          {suffix}
        </span>
      </div>
      {(trendLabel || description) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {trendLabel && (
            <span
              className={cn(
                "font-semibold",
                trend === "up" && "text-rise",
                trend === "down" && "text-drop",
                trend === "neutral" && "text-muted"
              )}
            >
              {trend === "up" ? "↑ " : trend === "down" ? "↓ " : ""}
              {trendLabel}
            </span>
          )}
          {description && <span className="text-muted">{description}</span>}
        </div>
      )}
    </div>
  );
};

export default Stat;
