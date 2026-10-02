import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Textarea = forwardRef(({ className, error, rows = 4, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full bg-surface text-text placeholder:text-muted/60 border border-line rounded-md px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:border-signal/80 focus:ring-1 focus:ring-signal/80 disabled:opacity-50 disabled:cursor-not-allowed resize-y",
        error && "border-rise focus:border-rise focus:ring-rise",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
