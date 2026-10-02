import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Scale, ArrowRight, Info } from "lucide-react";
import { useCompare } from "../../features/compare/CompareContext";
import Button from "../ui/Button";

const CompareBar = () => {
  const { compareItems, removeFromCompare } = useCompare();

  if (compareItems.length === 0) {
    return null;
  }

  const ids = compareItems.map((item) => item._id).join(",");
  const canCompare = compareItems.length >= 2;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Comparison dock"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl bg-surface/95 backdrop-blur-md border border-line rounded-lg p-3 sm:p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          {/* Thumbnails + remove buttons */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {compareItems.map((item) => (
              <div
                key={item._id}
                className="relative group shrink-0 w-11 h-11 rounded-md border border-line bg-surface-2 p-1 flex items-center justify-center"
              >
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/60"}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => removeFromCompare(item._id)}
                  title={`Remove ${item.title}`}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rise text-black flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}

            {/* Empty slots visual cues up to 4 */}
            {Array.from({ length: Math.max(0, 4 - compareItems.length) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="w-11 h-11 rounded-md border border-dashed border-line/60 bg-surface/40 flex items-center justify-center text-[10px] font-mono text-muted/60 select-none shrink-0"
                >
                  +
                </div>
              )
            )}
          </div>

          {/* Status & CTA */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <div className="text-right">
              <span className="font-mono text-xs font-semibold text-text tabular-nums">
                {compareItems.length}/4
              </span>
              {!canCompare ? (
                <p className="text-[10px] text-muted flex items-center gap-1 justify-end">
                  <Info className="w-3 h-3 text-warn" /> Add 1 more
                </p>
              ) : (
                <p className="text-[10px] text-signal font-mono uppercase tracking-tight">
                  Ready to compare
                </p>
              )}
            </div>

            {canCompare ? (
              <Link to={`/compare?ids=${ids}`}>
                <Button
                  variant="signal"
                  size="sm"
                  icon={Scale}
                  className="whitespace-nowrap"
                >
                  <span>Compare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="opacity-50 cursor-not-allowed whitespace-nowrap"
              >
                Select ≥ 2
              </Button>
            )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default CompareBar;