import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const Select = forwardRef(
  ({ className, error, children, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none bg-surface text-text border border-line rounded-md px-3.5 py-2.5 pr-10 text-sm transition-all focus:outline-none focus:border-signal/80 focus:ring-1 focus:ring-signal/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
            Icon && "pl-10",
            error && "border-rise focus:border-rise focus:ring-rise",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
