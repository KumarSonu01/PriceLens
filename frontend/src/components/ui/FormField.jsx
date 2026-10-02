import { cn } from "../../lib/utils";

const FormField = ({
  label,
  hint,
  error,
  required = false,
  className,
  children,
  htmlFor,
}) => {
  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={htmlFor}
            className="text-xs font-semibold tracking-wide uppercase text-muted"
          >
            {label}
            {required && <span className="text-rise ml-1">*</span>}
          </label>
          {hint && <span className="text-xs text-muted/70">{hint}</span>}
        </div>
      )}
      {children}
      {error && <p className="text-xs text-rise font-medium mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
