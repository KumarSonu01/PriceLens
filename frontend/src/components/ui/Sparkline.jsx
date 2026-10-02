import { cn } from "../../lib/utils";

const Sparkline = ({
  data = [],
  width = 72,
  height = 24,
  strokeWidth = 1.5,
  color,
  className,
}) => {
  if (!data || data.length < 2) return null;

  const numericData = data
    .map((d) => (typeof d === "number" ? d : d.price || 0))
    .filter((n) => typeof n === "number" && !isNaN(n));

  if (numericData.length < 2) return null;

  const min = Math.min(...numericData);
  const max = Math.max(...numericData);
  const range = max - min || 1;

  // Calculate coordinates
  const points = numericData.map((val, index) => {
    const x = (index / (numericData.length - 1)) * (width - 4) + 2;
    const y = height - 3 - ((val - min) / range) * (height - 6);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  // Determine color: if last price <= first price, price fell or stayed down (signal/drop)
  const isDown = numericData[numericData.length - 1] <= numericData[0];
  const strokeColor =
    color || (isDown ? "var(--color-signal)" : "var(--color-rise)");

  return (
    <svg
      width={width}
      height={height}
      className={cn("overflow-visible shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;
