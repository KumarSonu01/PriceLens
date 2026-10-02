import { cn } from "../../lib/utils";

const Badge = ({
  className,
  variant = "neutral",
  size = "md",
  children,
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center gap-1.5 font-medium rounded-full tracking-tight select-none";

  const variants = {
    signal:
      "bg-signal/15 text-signal border border-signal/30",
    drop:
      "bg-drop/15 text-drop border border-drop/30",
    rise:
      "bg-rise/15 text-rise border border-rise/30",
    warn:
      "bg-warn/15 text-warn border border-warn/30",
    neutral:
      "bg-surface-2 text-muted border border-line",
    outline:
      "bg-transparent text-text border border-line",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};

export default Badge;
