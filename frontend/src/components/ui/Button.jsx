import { forwardRef } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const Button = forwardRef(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      loading = false,
      disabled = false,
      children,
      icon: Icon,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none text-center";

    const variants = {
      signal:
        "bg-signal text-[#0B0D0C] font-semibold hover:opacity-90 active:scale-[0.98] shadow-sm",
      secondary:
        "bg-surface-2 text-text border border-line hover:border-text/30 active:scale-[0.98]",
      outline:
        "bg-transparent text-text border border-line hover:bg-surface-2 active:scale-[0.98]",
      ghost:
        "bg-transparent text-muted hover:text-text hover:bg-surface-2 active:scale-[0.98]",
      danger:
        "bg-rise/10 text-rise border border-rise/30 hover:bg-rise/20 active:scale-[0.98]",
      subtle:
        "bg-surface text-muted border border-line hover:text-text hover:border-text/20",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base font-semibold",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : Icon ? (
          <Icon className="w-4 h-4 shrink-0" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
