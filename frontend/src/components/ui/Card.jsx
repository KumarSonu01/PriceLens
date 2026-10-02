import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Card = forwardRef(
  (
    {
      className,
      hoverable = false,
      glow = false,
      children,
      as: Component = "div",
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "bg-surface text-text border border-line rounded-lg transition-all duration-200",
          hoverable &&
            "hover:border-text/25 hover:bg-surface/90 hover:shadow-spotlight",
          glow && "border-signal/30 shadow-[0_0_20px_-6px_rgba(200,241,59,0.15)]",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";

export default Card;
