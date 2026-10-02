import Button from "./Button";
import { SearchX } from "lucide-react";
import { cn } from "../../lib/utils";

const EmptyState = ({
  icon: Icon = SearchX,
  title = "No results found",
  description = "Try adjusting your filters or search keywords.",
  actionLabel,
  onAction,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-10 sm:p-14 bg-surface border border-line rounded-lg my-6",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-surface-2 border border-line flex items-center justify-center text-muted mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-text tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-muted mt-2 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          className="mt-6"
        >
          {actionLabel}
        </Button>
      )}
      {children}
    </div>
  );
};

export default EmptyState;
