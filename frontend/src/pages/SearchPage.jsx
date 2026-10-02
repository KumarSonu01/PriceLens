import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import ProductSkeleton from "../components/product/ProductSkeleton";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

const POPULAR_SUGGESTIONS = [
  "iPhone",
  "MacBook",
  "Sony Headphones",
  "Samsung Galaxy",
  "OLED TV",
  "iPad",
];

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(keyword);
  const [sortBy, setSortBy] = useState("relevance");

  const [prevKeyword, setPrevKeyword] = useState(keyword);
  if (keyword !== prevKeyword) {
    setPrevKeyword(keyword);
    setSearchInput(keyword);
  }

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        `/products?keyword=${encodeURIComponent(keyword)}`
      );

      setProducts(data.products || []);
    } catch {
      setError("Failed to fetch product intelligence for this query.");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate("/");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "priceLow") return (a.lowestPrice || Infinity) - (b.lowestPrice || Infinity);
    if (sortBy === "priceHigh") return (b.lowestPrice || 0) - (a.lowestPrice || 0);
    return 0;
  });

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-8 min-h-[80vh] space-y-8">
      {/* Search Header */}
      <div className="space-y-4 border-b border-line pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase">
          <Link to="/" className="hover:text-text">Catalog</Link>
          <span>/</span>
          <span>Search Intelligence</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
              Results for <span className="font-serif italic text-signal">"{keyword || "All"}"</span>
            </h1>
            <p className="text-sm text-muted mt-1 font-mono">
              {!loading && `${products.length} products indexed in query`}
            </p>
          </div>

          {/* Refine Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Refine search..."
                className="w-full bg-surface border border-line rounded-md pl-9 pr-3 py-2 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:border-signal/80"
              />
            </div>
            <Button type="submit" variant="secondary" size="md">
              Update
            </Button>
          </form>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            {keyword && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 border border-line rounded-full text-xs font-mono text-text">
                Keyword: <strong className="text-signal">{keyword}</strong>
                <button
                  type="button"
                  onClick={() => navigate("/search")}
                  className="hover:text-rise cursor-pointer ml-1 text-sm leading-none"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-mono hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface text-text border border-line rounded-md px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-signal/80 cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid States */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Search Failed"
          message={error}
          onRetry={fetchProducts}
        />
      ) : products.length === 0 ? (
        <div className="space-y-8">
          <EmptyState
            title="No Matching Hardware in Feed"
            description={`We couldn't locate any products matching "${keyword}". Try searching for popular models or brands below.`}
          >
            <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {POPULAR_SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => navigate(`/search?keyword=${encodeURIComponent(term)}`)}
                  className="px-3 py-1.5 rounded-full border border-line bg-surface-2 text-xs font-medium text-text hover:border-signal hover:text-signal transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </EmptyState>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;