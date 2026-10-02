import { forwardRef } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const IconButton = forwardRef(
  (
    {
      className,
      variant = "ghost",
      size = "md",
      loading = false,
      disabled = false,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-50 disabled:pointer-events-none cursor-pointer shrink-0";

    const variants = {
      signal:
        "bg-signal text-[#0B0D0C] hover:opacity-90 active:scale-95",
      secondary:
        "bg-surface-2 text-text border border-line hover:border-text/30 active:scale-95",
      outline:
        "bg-transparent text-text border border-line hover:bg-surface-2 active:scale-95",
      ghost:
        "bg-transparent text-muted hover:text-text hover:bg-surface-2 active:scale-95",
      danger:
        "bg-rise/10 text-rise border border-rise/30 hover:bg-rise/20 active:scale-95",
    };

    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
