import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import IconButton from "./IconButton";

const Drawer = ({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  side = "bottom", // 'bottom' | 'right'
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const slideVariants = {
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
    },
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            className={cn(
              "fixed inset-0 pointer-events-none flex",
              side === "bottom" ? "items-end" : "justify-end"
            )}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={slideVariants[side].initial}
              animate={slideVariants[side].animate}
              exit={slideVariants[side].exit}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={cn(
                "pointer-events-auto bg-surface text-text border-line shadow-2xl overflow-y-auto max-h-[90vh]",
                side === "bottom"
                  ? "w-full border-t rounded-t-lg p-6"
                  : "h-full w-full max-w-md border-l p-6",
                className
              )}
            >
              {side === "bottom" && (
                <div className="w-12 h-1 bg-line rounded-full mx-auto mb-4" />
              )}
              <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-line">
                <div>
                  {title && (
                    <h2 className="text-xl font-bold tracking-tight text-text">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-xs text-muted mt-1">{description}</p>
                  )}
                </div>
                {onClose && (
                  <IconButton
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    aria-label="Close drawer"
                  >
                    <X className="w-4 h-4" />
                  </IconButton>
                )}
              </div>
              <div>{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
