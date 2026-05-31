const RelatedProducts = ({
  products,
}) => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        You May Also Like
      </h2>

      <div className="grid md:grid-cols-4 gap-6">
        {products?.map(
          (product) => (
            <div
              key={
                product._id
              }
            >
              {product.title}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;