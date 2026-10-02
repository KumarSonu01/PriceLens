import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";

const ProductSkeleton = () => {
  return (
    <Card className="p-4 sm:p-5 flex flex-col h-full overflow-hidden">
      <Skeleton className="w-full h-52 sm:h-56 rounded-md mb-4" />
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="w-20 h-4 rounded-sm" />
        <Skeleton className="w-14 h-4 rounded-full" />
      </div>
      <Skeleton className="w-full h-5 rounded-sm mb-2" />
      <Skeleton className="w-3/4 h-5 rounded-sm mb-6" />

      <div className="mt-auto pt-4 border-t border-line/60 flex items-end justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="w-16 h-3 rounded-sm" />
          <Skeleton className="w-24 h-7 rounded-sm" />
        </div>
        <Skeleton className="w-24 h-9 rounded-md" />
      </div>
    </Card>
  );
};

export default ProductSkeleton;