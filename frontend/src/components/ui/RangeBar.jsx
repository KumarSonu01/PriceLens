import { cn } from "../../lib/utils";

const RangeBar = ({
  low = 0,
  avg = 0,
  high = 0,
  current = 0,
  className,
}) => {
  if (!low || !high || low === high) return null;

  const range = high - low;
  const currentPos = Math.max(0, Math.min(100, ((current - low) / range) * 100));
  const avgPos = avg ? Math.max(0, Math.min(100, ((avg - low) / range) * 100)) : null;

  return (
    <div className={cn("w-full space-y-2 select-none", className)}>
      <div className="flex items-center justify-between text-xs text-muted font-mono">
        <span>Low: ₹{low.toLocaleString("en-IN")}</span>
        {avg > 0 && <span>Avg: ₹{avg.toLocaleString("en-IN")}</span>}
        <span>High: ₹{high.toLocaleString("en-IN")}</span>
      </div>

      {/* Bar track */}
      <div className="relative h-2 w-full bg-surface-2 border border-line rounded-full overflow-hidden">
        {/* Fill from low to current */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-signal/30 rounded-full"
          style={{ width: `${currentPos}%` }}
        />

        {/* Avg marker line */}
        {avgPos !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-muted/60"
            style={{ left: `${avgPos}%` }}
            title={`Average: ₹${avg.toLocaleString()}`}
          />
        )}

        {/* Current price indicator */}
        <div
          className="absolute top-0 bottom-0 w-2 bg-signal rounded-full shadow-glow -translate-x-1"
          style={{ left: `${currentPos}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted font-sans">
        <span className="text-drop font-medium">Best in market</span>
        {current > 0 && (
          <span className="font-mono text-text font-semibold">
            Current: ₹{current.toLocaleString("en-IN")}
          </span>
        )}
        <span>Highest listed</span>
      </div>
    </div>
  );
};

export default RangeBar;
