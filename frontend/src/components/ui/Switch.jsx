import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  className,
  id,
  label,
  ...props
}) => {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        id={id}
        onClick={() => onChange && onChange(!checked)}
        className={cn(
          "w-11 h-6 rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          checked ? "bg-signal" : "bg-surface-2 border border-line"
        )}
        {...props}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "w-5 h-5 rounded-full shadow-sm",
            checked ? "bg-[#0B0D0C]" : "bg-muted"
          )}
          style={{
            marginLeft: checked ? "auto" : "0",
          }}
        />
      </button>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-text select-none cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Switch;
