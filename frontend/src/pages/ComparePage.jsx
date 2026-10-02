import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Scale, X, Check, Plus } from "lucide-react";
import api from "../api/axios";
import { useCompare } from "../features/compare/CompareContext";
import Button from "../components/ui/Button";
import Switch from "../components/ui/Switch";
import PriceTag from "../components/ui/PriceTag";
import EmptyState from "../components/ui/EmptyState";

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { removeFromCompare } = useCompare();

  const [products, setProducts] = useState([]);
  const [comparisonRows, setComparisonRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  const ids = searchParams.get("ids") || "";

  useEffect(() => {
    const fetchComparison = async () => {
      if (!ids) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await api.get(`/comparison?ids=${ids}`);
        setProducts(data.products || []);
        setComparisonRows(data.comparisonRows || []);
      } catch (error) {
        console.log("Comparison fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [ids]);

  const handleRemoveProduct = (productId) => {
    removeFromCompare(productId);
    const remaining = products.filter((p) => p._id !== productId);
    if (remaining.length >= 2) {
      const newIds = remaining.map((p) => p._id).join(",");
      navigate(`/compare?ids=${newIds}`, { replace: true });
    } else {
      navigate("/compare", { replace: true });
    }
  };

  // Lowest price among compared devices
  const lowestPrice = useMemo(() => {
    if (!products || products.length === 0) return 0;
    const prices = products.map((p) => p.lowestPrice).filter(Boolean);
    return prices.length > 0 ? Math.min(...prices) : 0;
  }, [products]);

  // Filter rows based on "Show differences only" switch
  const filteredRows = useMemo(() => {
    if (!showDiffOnly) return comparisonRows;
    return comparisonRows.filter((row) => {
      if (!row.values || row.values.length <= 1) return false;
      const first = String(row.values[0] || "").trim().toLowerCase();
      return row.values.some((v) => String(v || "").trim().toLowerCase() !== first);
    });
  }, [comparisonRows, showDiffOnly]);

  if (loading) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-line border-t-signal animate-spin" />
        <span className="font-mono text-xs text-muted uppercase tracking-wider">
          Compiling Side-by-Side Analysis...
        </span>
      </div>
    );
  }

  if (products.length < 2) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          icon={Scale}
          title="Comparison Matrix Requires ≥ 2 Models"
          description="Select 2 to 4 products across the catalog to generate a real-time side-by-side spec and landed-price differential matrix."
          actionLabel="Explore Hardware Catalog"
          onAction={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase">
            <Link to="/" className="hover:text-text">
              Catalog
            </Link>
            <span>/</span>
            <span>Side-by-Side Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text mt-1">
            Hardware Comparison Matrix
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Switch
            checked={showDiffOnly}
            onChange={setShowDiffOnly}
            id="diff-switch"
            label="Highlight differences only"
          />
          <Link to="/">
            <Button variant="outline" size="sm" icon={Plus}>
              Add Another SKU
            </Button>
          </Link>
        </div>
      </div>

      {/* Comparison Table Grid with Sticky Header and First Column */}
      <div className="w-full overflow-hidden border border-line rounded-lg bg-surface shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            {/* Sticky Product Cards Header */}
            <thead>
              <tr className="border-b border-line bg-surface-2/60">
                <th className="sticky left-0 z-20 bg-surface-2 p-4 text-xs font-mono uppercase tracking-wider text-muted min-w-[180px] sm:min-w-[220px] border-r border-line">
                  Product Overview
                </th>

                {products.map((product) => {
                  const isLowest = product.lowestPrice === lowestPrice;
                  return (
                    <th
                      key={product._id}
                      className="p-4 sm:p-5 min-w-[260px] max-w-[320px] align-top border-r border-line last:border-r-0 relative group"
                    >
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product._id)}
                        title="Remove from comparison"
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-surface border border-line flex items-center justify-center text-muted hover:text-rise hover:border-rise/40 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Product image */}
                      <div className="w-full h-36 bg-surface-2/40 border border-line rounded-md p-2 flex items-center justify-center mb-3">
                        <img
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/200"
                          }
                          alt={product.title}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                        {product.brand}
                      </p>

                      <Link to={`/product/${product._id}`}>
                        <h3 className="font-bold text-sm text-text line-clamp-2 hover:text-signal transition-colors mb-2 min-h-[38px]">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-line/60">
                        <div>
                          <PriceTag
                            price={product.lowestPrice}
                            size="md"
                            highlight={isLowest}
                          />
                        </div>
                        {isLowest && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-signal/15 text-signal border border-signal/30 font-bold uppercase">
                            Best Rate
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {/* Category Row */}
              <tr className="hover:bg-surface-2/30 transition-colors">
                <td className="sticky left-0 z-10 bg-surface p-3.5 text-xs font-mono uppercase tracking-wider text-muted border-r border-line">
                  Hardware Category
                </td>
                {products.map((p) => (
                  <td key={p._id + "-cat"} className="p-3.5 text-xs text-text border-r border-line last:border-r-0 font-medium">
                    {p.category}
                  </td>
                ))}
              </tr>

              {/* Rating Row */}
              <tr className="hover:bg-surface-2/30 transition-colors">
                <td className="sticky left-0 z-10 bg-surface p-3.5 text-xs font-mono uppercase tracking-wider text-muted border-r border-line">
                  Customer Score
                </td>
                {products.map((p) => (
                  <td key={p._id + "-rat"} className="p-3.5 text-xs font-mono text-text border-r border-line last:border-r-0">
                    ★ {p.overallRating || "4.5"} / 5.0
                  </td>
                ))}
              </tr>

              {/* Landed Lowest Price Row */}
              <tr className="bg-signal/5 hover:bg-signal/10 transition-colors">
                <td className="sticky left-0 z-10 bg-surface p-3.5 text-xs font-mono uppercase tracking-wider text-signal border-r border-line font-bold">
                  Market Landed Price
                </td>
                {products.map((p) => {
                  const isLowest = p.lowestPrice === lowestPrice;
                  return (
                    <td
                      key={p._id + "-price"}
                      className={`p-3.5 font-mono text-sm border-r border-line last:border-r-0 ${
                        isLowest
                          ? "text-signal font-bold"
                          : "text-text"
                      }`}
                    >
                      {p.lowestPrice ? `₹${p.lowestPrice.toLocaleString("en-IN")}` : "No Active Index"}
                    </td>
                  );
                })}
              </tr>

              {/* Key Features */}
              <tr className="hover:bg-surface-2/30 transition-colors">
                <td className="sticky left-0 z-10 bg-surface p-3.5 text-xs font-mono uppercase tracking-wider text-muted border-r border-line">
                  Key Differentiators
                </td>
                {products.map((p) => (
                  <td key={p._id + "-feat"} className="p-3.5 text-xs text-text border-r border-line last:border-r-0">
                    <ul className="space-y-1">
                      {p.features?.slice(0, 4).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-muted">
                          <Check className="w-3.5 h-3.5 text-signal shrink-0 mt-0.5" />
                          <span className="text-text">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Specifications Matrix from comparisonRows */}
              {filteredRows.map((row) => (
                <tr key={row.spec} className="hover:bg-surface-2/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-surface p-3.5 text-xs font-mono uppercase tracking-wider text-muted border-r border-line">
                    {row.spec}
                  </td>
                  {row.values?.map((val, idx) => (
                    <td
                      key={row.spec + idx}
                      className="p-3.5 text-xs text-text border-r border-line last:border-r-0 font-medium"
                    >
                      {val || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;