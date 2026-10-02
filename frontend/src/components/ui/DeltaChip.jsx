import { cn } from "../../lib/utils";

const DeltaChip = ({
  delta, // percentage value, e.g. -8.2 or 4.5
  label = "vs avg",
  className,
}) => {
  if (delta === null || delta === undefined || isNaN(delta)) {
    return null;
  }

  const numDelta = typeof delta === "number" ? delta : parseFloat(delta);
  if (numDelta === 0) return null;

  const isDrop = numDelta < 0; // price fell is good
  const formattedVal = Math.abs(numDelta).toFixed(1);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full border tabular-nums",
        isDrop
          ? "bg-drop/15 text-drop border-drop/30"
          : "bg-rise/15 text-rise border-rise/30",
        className
      )}
    >
      <span>{isDrop ? "▼" : "▲"}</span>
      <span>{formattedVal}%</span>
      {label && <span className="font-sans text-[10px] opacity-80">{label}</span>}
    </span>
  );
};

export default DeltaChip;
