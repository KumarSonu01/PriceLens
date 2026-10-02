import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Tv,
  Camera,
  Gamepad2,
  Cpu,
  Clock,
  RotateCcw,
} from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import ProductSkeleton from "../components/product/ProductSkeleton";
import SplineHero from "../components/ui/SplineHero";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

const CATEGORIES = [
  { name: "Mobile", icon: Smartphone, label: "Mobiles" },
  { name: "Laptop", icon: Laptop, label: "Laptops" },
  { name: "Tablet", icon: Tablet, label: "Tablets" },
  { name: "Headphones", icon: Headphones, label: "Audio" },
  { name: "Smartwatch", icon: Watch, label: "Watches" },
  { name: "Television", icon: Tv, label: "TVs" },
  { name: "Camera", icon: Camera, label: "Cameras" },
  { name: "Gaming", icon: Gamepad2, label: "Gaming" },
  { name: "Accessories", icon: Cpu, label: "Accessories" },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const sort = searchParams.get("sort") || "";
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(keyword);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Sync search input if keyword in URL changes externally
  const [prevKeyword, setPrevKeyword] = useState(keyword);
  if (keyword !== prevKeyword) {
    setPrevKeyword(keyword);
    setSearchInput(keyword);
  }

  // Load recently viewed products from localStorage
  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem("pl-recently-viewed") || "[]");
      if (Array.isArray(items)) {
        setRecentlyViewed(items.slice(0, 4));
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        `/products?keyword=${encodeURIComponent(keyword)}&sort=${sort}&category=${category}&page=${page}&limit=6`
      );

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalProductsCount(data.totalProducts || data.products?.length || 0);
    } catch {
      setError("Failed to load catalog products. Please check connection.");
    } finally {
      setLoading(false);
    }
  }, [keyword, sort, category, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateSearchParams = (newParams) => {
    const params = {};

    if (keyword) params.keyword = keyword;
    if (sort) params.sort = sort;
    if (category) params.category = category;
    if (page) params.page = page;

    Object.assign(params, newParams);

    Object.keys(params).forEach((key) => {
      if (params[key] === "" || params[key] === null) {
        delete params[key];
      }
    });

    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    updateSearchParams({
      sort: e.target.value,
      page: 1,
    });
  };

  const handleCategoryChange = (selectedCategory) => {
    if (category === selectedCategory) {
      updateSearchParams({ category: "", page: 1 });
    } else {
      updateSearchParams({ category: selectedCategory, page: 1 });
    }
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
    window.scrollTo({ top: 650, behavior: "smooth" });
  };

  const searchHandler = (e) => {
    e.preventDefault();
    updateSearchParams({
      keyword: searchInput.trim(),
      page: 1,
    });
  };

  // Derive "biggest drops" strip from currently fetched data
  const biggestDrops = useMemo(() => {
    return products
      .filter((p) => p.lowestPrice && p.lowestPrice > 0)
      .slice(0, 3);
  }, [products]);

  return (
    <div className="w-full space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-line bg-surface/40 pt-12 pb-16 lg:py-24">
        {/* Subtle grid texture overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy & Input */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line bg-surface-2 text-xs font-mono uppercase tracking-wider text-signal">
                <span className="w-2 h-2 rounded-full bg-signal shadow-glow" />
                MARKET INTELLIGENCE FEED
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text leading-[1.08]">
                Precision <span className="font-serif italic font-normal text-signal">intelligence</span> for every price tag.
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
                Compare Amazon, Flipkart, Zepto, and local stores side by side. Historical charts, price drop alerts, and true market transparency.
              </p>

              {/* Large Search Bar with Quick Chips */}
              <form
                onSubmit={searchHandler}
                className="p-1.5 bg-surface border border-line rounded-lg shadow-2xl flex flex-col sm:flex-row gap-2 max-w-xl focus-within:border-signal/80 focus-within:ring-1 focus-within:ring-signal/80 transition-all"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 text-muted ml-3 shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search phones, laptops, audio..."
                    className="w-full bg-transparent px-3 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none"
                  />
                </div>
                <Button type="submit" variant="signal" size="md">
                  Inspect Prices
                </Button>
              </form>

              {/* Quick Category Chips */}
              <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                <span className="text-muted font-mono uppercase text-[10px] mr-1">
                  Popular:
                </span>
                {["Mobile", "Laptop", "Headphones", "Television"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-2.5 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                      category === cat
                        ? "bg-signal text-black font-semibold border-signal"
                        : "bg-surface-2/60 text-muted border-line hover:text-text hover:border-text/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Spline / Aperture Lens Visual */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <SplineHero className="w-full h-[400px] flex items-center justify-center" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. BIGGEST DROPS STRIP (if computable) */}
      {biggestDrops.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="p-4 sm:p-6 bg-surface-2/40 border border-line rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-drop/15 text-drop flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight uppercase font-mono text-text">
                    Active Price Drops Today
                  </h3>
                  <p className="text-xs text-muted">
                    Verified lowest rates across indexed stores
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block font-mono text-xs text-signal font-semibold">
                ● Live Delta Feed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {biggestDrops.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  className="p-3 bg-surface border border-line rounded-md hover:border-text/30 transition-all flex items-center gap-3 group"
                >
                  <img
                    src={item.images?.[0] || "https://via.placeholder.com/60"}
                    alt={item.title}
                    className="w-12 h-12 rounded object-contain bg-surface-2 p-1 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-text truncate group-hover:text-signal">
                      {item.title}
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-mono text-sm font-bold text-signal tabular-nums">
                        ₹{item.lowestPrice?.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] font-mono text-drop bg-drop/10 px-1 rounded">
                        Lowest
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-text transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. BENTO GRID: CATEGORIES & COVERAGE */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted">
              CATALOG DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
              Browse by Hardware Category
            </h2>
          </div>
          <span className="text-xs font-mono text-muted">
            9 Indexed Sectors
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryChange(cat.name)}
                className={`p-4 rounded-lg border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 ${
                  isSelected
                    ? "bg-signal text-black border-signal shadow-sm"
                    : "bg-surface text-text border-line hover:border-text/30 hover:bg-surface-2"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isSelected ? "text-black" : "text-muted"
                  }`}
                />
                <div>
                  <p className="font-bold text-sm tracking-tight">
                    {cat.label}
                  </p>
                  <p
                    className={`text-[10px] font-mono uppercase ${
                      isSelected ? "text-black/70" : "text-muted"
                    }`}
                  >
                    View Models →
                  </p>
                </div>
              </button>
            );
          })}

          {/* Platform Coverage Tile in Bento */}
          <div className="p-4 rounded-lg border border-line bg-surface-2/60 flex flex-col justify-between h-28 col-span-2 sm:col-span-1">
            <ShieldCheck className="w-6 h-6 text-signal" />
            <div>
              <p className="font-bold text-sm text-text">Multi-Source</p>
              <p className="text-[10px] font-mono text-muted uppercase">
                Online & Local Shops
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS: 3 NUMBERED STEPS */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="border border-line rounded-lg p-6 sm:p-10 bg-surface">
          <div className="max-w-md mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-signal">
              PROTOCOL
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text mt-1">
              How PriceLens Delivers Truth
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-md border border-line bg-surface-2/30 space-y-3">
              <span className="font-mono text-2xl font-bold text-signal">01</span>
              <h3 className="font-bold text-base text-text">Live Aggregation</h3>
              <p className="text-xs text-muted leading-relaxed">
                We continuously scrape and sync listings from Amazon, Flipkart, Zepto, and local electronics retailers.
              </p>
            </div>

            <div className="p-5 rounded-md border border-line bg-surface-2/30 space-y-3">
              <span className="font-mono text-2xl font-bold text-signal">02</span>
              <h3 className="font-bold text-base text-text">Terminal Comparison</h3>
              <p className="text-xs text-muted leading-relaxed">
                Rank sellers by total landed cost, warranty, delivery timeframe, and stock availability across cities.
              </p>
            </div>

            <div className="p-5 rounded-md border border-line bg-surface-2/30 space-y-3">
              <span className="font-mono text-2xl font-bold text-signal">03</span>
              <h3 className="font-bold text-base text-text">Autonomous Tracking</h3>
              <p className="text-xs text-muted leading-relaxed">
                Set target price thresholds. PriceLens notifies you the moment any verified seller drops into your zone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT CATALOG WITH STICKY FILTER/SORT BAR */}
      <section id="catalog" className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Sticky Filter & Sort Bar */}
        <div className="sticky top-16 z-30 bg-bg/95 backdrop-blur-md py-4 border-b border-line mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-text tracking-tight">
                Market Catalog
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 bg-surface-2 border border-line rounded text-muted tabular-nums">
                {totalProductsCount} Products
              </span>
              {category && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-signal/15 text-signal border border-signal/30 rounded-full text-xs font-mono">
                  {category}
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className="hover:text-text cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={handleSortChange}
                className="bg-surface text-text border border-line rounded-md px-3 py-2 text-xs font-medium focus:outline-none focus:border-signal/80 cursor-pointer"
              >
                <option value="">Default Ranking</option>
                <option value="latest">Recently Added</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              {(keyword || sort || category) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchParams({})}
                  icon={RotateCcw}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to Load Catalog"
            message={error}
            onRetry={fetchProducts}
          />
        ) : products.length === 0 ? (
          <EmptyState
            title="No Matching Hardware Found"
            description="Try changing category filters or searching with a different keyword."
            actionLabel="Reset All Filters"
            onAction={() => setSearchParams({})}
          />
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-line">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pNum = i + 1;
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => handlePageChange(pNum)}
                        className={`w-8 h-8 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer tabular-nums ${
                          page === pNum
                            ? "bg-signal text-black font-bold"
                            : "bg-surface text-muted border border-line hover:text-text"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. RECENTLY VIEWED (localStorage) */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="border-t border-line pt-8">
            <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-wider text-muted">
              <Clock className="w-3.5 h-3.5" />
              <span>Recently Viewed Intel</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  className="p-3 bg-surface border border-line rounded-md hover:border-text/30 transition-all flex items-center gap-3 group"
                >
                  <img
                    src={item.image || "https://via.placeholder.com/50"}
                    alt={item.title}
                    className="w-10 h-10 object-contain rounded bg-surface-2 p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text truncate group-hover:text-signal">
                      {item.title}
                    </p>
                    {item.price && (
                      <p className="font-mono text-xs text-signal font-bold tabular-nums">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;