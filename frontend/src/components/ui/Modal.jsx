import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import IconButton from "./IconButton";

const Modal = ({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "max-w-lg",
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className={cn(
              "relative w-full bg-surface border border-line rounded-lg p-6 shadow-2xl text-text z-10",
              maxWidth,
              className
            )}
          >
            {(title || onClose) && (
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
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" />
                  </IconButton>
                )}
              </div>
            )}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
