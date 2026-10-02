import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(
  ({ className, type = "text", error, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full bg-surface text-text placeholder:text-muted/60 border border-line rounded-md px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:border-signal/80 focus:ring-1 focus:ring-signal/80 disabled:opacity-50 disabled:cursor-not-allowed",
            Icon && "pl-10",
            error && "border-rise focus:border-rise focus:ring-rise",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
