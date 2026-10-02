import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Card from "../ui/Card";
import PriceTag from "../ui/PriceTag";

const RelatedProducts = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-text">
            Comparable Hardware Models
          </h2>
          <p className="text-xs text-muted">
            Frequently compared devices in this category
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group block h-full"
          >
            <Card hoverable className="p-4 flex flex-col h-full justify-between">
              <div>
                <div className="h-44 bg-surface-2/40 rounded-md overflow-hidden flex items-center justify-center p-3 mb-3 border border-line/50">
                  <img
                    src={
                      product.images?.[0] ||
                      "https://via.placeholder.com/200"
                    }
                    alt={product.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                  {product.brand}
                </p>
                <h3 className="font-semibold text-xs sm:text-sm text-text line-clamp-2 min-h-[36px] group-hover:text-signal transition-colors">
                  {product.title}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
                <div>
                  <PriceTag price={product.lowestPrice} size="sm" />
                </div>
                <span className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center text-muted group-hover:bg-signal group-hover:text-black transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;