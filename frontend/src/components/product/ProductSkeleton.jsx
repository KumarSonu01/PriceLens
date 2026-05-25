const ProductSkeleton = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow animate-pulse">
      <div className="w-full h-52 bg-gray-300 rounded"></div>

      <div className="h-6 bg-gray-300 rounded mt-4"></div>

      <div className="h-4 bg-gray-300 rounded mt-3 w-2/3"></div>

      <div className="h-4 bg-gray-300 rounded mt-2 w-1/2"></div>

      <div className="h-8 bg-gray-300 rounded mt-5 w-1/3"></div>
    </div>
  );
};

export default ProductSkeleton;