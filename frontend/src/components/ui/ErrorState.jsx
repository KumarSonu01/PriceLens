import Button from "./Button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

const ErrorState = ({
  title = "Failed to load data",
  message = "An error occurred while fetching information. Please try again.",
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface border border-line rounded-lg my-6",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-rise/10 border border-rise/30 flex items-center justify-center text-rise mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-text tracking-tight">{title}</h3>
      <p className="text-sm text-muted mt-2 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          icon={RefreshCw}
          className="mt-6"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
