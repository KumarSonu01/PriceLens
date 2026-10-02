import { cn } from "../../lib/utils";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-surface-2/80 rounded-md border border-line/40",
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
