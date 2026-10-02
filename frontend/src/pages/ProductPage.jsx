import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

import ProductHero from "../components/product/ProductHero";
import ComparisonTable from "../components/product/ComparisonTable";
import ListingCard from "../components/listing/ListingCard";
import LocalSellerCard from "../components/product/LocalSellerCard";
import PriceHistoryChart from "../components/product/PriceHistoryChart";
import ReviewSection from "../components/review/ReviewSection";
import RelatedProducts from "../components/product/RelatedProducts";

import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import FormField from "../components/ui/FormField";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";

const ProductPageSkeleton = () => {
  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-8 space-y-12">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-4">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-16 h-16 rounded-md" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 space-y-6">
          <Skeleton className="w-1/3 h-4 rounded-sm" />
          <Skeleton className="w-full h-10 rounded-sm" />
          <Skeleton className="w-1/2 h-8 rounded-sm" />
          <Skeleton className="w-full h-24 rounded-lg" />
          <Skeleton className="w-full h-12 rounded-md" />
        </div>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [listings, setListings] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState(0);
  const [targetPrice, setTargetPrice] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertSubmitting, setAlertSubmitting] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);

  const lowestPrice = useMemo(() => {
    return listings.length > 0
      ? Math.min(...listings.map((l) => l.price))
      : product?.lowestPrice || null;
  }, [listings, product]);

  const highestPrice = useMemo(() => {
    return listings.length > 0
      ? Math.max(...listings.map((l) => l.price))
      : null;
  }, [listings]);

  const marketAverage = useMemo(() => {
    return listings.length > 0
      ? Math.round(
          listings.reduce((acc, l) => acc + l.price, 0) / listings.length
        )
      : 0;
  }, [listings]);

  const sortedListings = useMemo(() => {
    return [...listings].sort((a, b) => a.price - b.price);
  }, [listings]);

  const bestListing = sortedListings[0];
  const bestListingId = bestListing?._id;
  const bestListingUrl = bestListing?.isScraped
    ? bestListing.productUrl
    : bestListing?.seller?.storeLink;

  const localSellers = useMemo(() => {
    return listings
      .filter((l) => !l.isScraped && l.seller)
      .map((l) => l.seller);
  }, [listings]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [productRes, listingsRes, historyRes, relatedRes] =
        await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/listings/product/${id}`),
          api.get(`/products/${id}/price-history`),
          api.get(`/products/${id}/related`),
        ]);

      setProduct(productRes.data);
      setListings(listingsRes.data || []);

      setPriceHistory(
        historyRes.data?.map((item) => ({
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : item.date,
          createdAt: item.createdAt,
          price: item.price,
        })) || []
      );

      setRelatedProducts(relatedRes.data || []);

      // Check wishlist status for logged-in user
      if (userInfo) {
        try {
          const wRes = await api.get(`/wishlist/check/${id}`);
          setIsWishlisted(wRes.data?.exists || false);
          setWishlistId(wRes.data?.wishlistId || null);
        } catch {
          // ignore check error
        }
      }

      // Save to Recently Viewed
      if (productRes.data) {
        try {
          const currentViewed = JSON.parse(
            localStorage.getItem("pl-recently-viewed") || "[]"
          );
          const filtered = currentViewed.filter(
            (p) => p._id !== productRes.data._id
          );
          const updated = [
            {
              _id: productRes.data._id,
              title: productRes.data.title,
              image: productRes.data.images?.[0] || "",
              price: productRes.data.lowestPrice || null,
            },
            ...filtered,
          ].slice(0, 10);
          localStorage.setItem(
            "pl-recently-viewed",
            JSON.stringify(updated)
          );
        } catch {
          // ignore
        }
      }
    } catch {
      setError("Failed to load product details. Please try again.");
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id, userInfo]);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  // Wishlist Toggle
  const toggleWishlist = async () => {
    if (!userInfo) {
      toast("Please log in to manage your wishlist", { icon: "🔒" });
      return;
    }

    try {
      setWishlistLoading(true);
      if (isWishlisted && wishlistId) {
        await api.delete(`/wishlist/${wishlistId}`);
        setIsWishlisted(false);
        setWishlistId(null);
        toast.success("Removed from wishlist");
      } else {
        const { data } = await api.post("/wishlist", {
          productId: product._id,
        });
        setIsWishlisted(true);
        setWishlistId(data._id);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Wishlist action failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  // Price Alert Submit
  const createAlert = async (e) => {
    e?.preventDefault();
    if (!userInfo) {
      toast("Please sign in to set price alerts", { icon: "🔒" });
      return;
    }
    const targetVal = Number(targetPrice);
    if (!targetVal || isNaN(targetVal) || targetVal <= 0) {
      toast.error("Enter a valid target price");
      return;
    }
    if (lowestPrice && targetVal >= lowestPrice) {
      toast.error("Target price must be lower than current best price");
      return;
    }

    try {
      setAlertSubmitting(true);
      await api.post("/alerts", {
        productId: product._id,
        targetPrice: targetVal,
      });

      toast.success(
        `Price alert activated for ₹${targetVal.toLocaleString("en-IN")}`
      );
      setTargetPrice("");
      setAlertModalOpen(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create price alert"
      );
    } finally {
      setAlertSubmitting(false);
    }
  };

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <ErrorState
          title="Product Unavailable"
          message={error}
          onRetry={fetchData}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-text">Product Not Found</h2>
        <p className="text-muted text-sm">
          This SKU may have been unlisted or removed from the catalog.
        </p>
        <Link to="/">
          <Button variant="secondary" size="md">
            Browse Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const alertDiffPercentage =
    lowestPrice && targetPrice && Number(targetPrice) < lowestPrice
      ? (
          ((lowestPrice - Number(targetPrice)) / lowestPrice) *
          100
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-8 space-y-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase">
        <Link to="/" className="hover:text-text">
          Catalog
        </Link>
        <span>/</span>
        <Link
          to={`/?category=${product.category}`}
          className="hover:text-text"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-text truncate max-w-xs">{product.title}</span>
      </div>

      {/* Flagship Hero Component */}
      <ProductHero
        product={product}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        lowestPrice={lowestPrice}
        highestPrice={highestPrice}
        marketAverage={marketAverage}
        userInfo={userInfo}
        isWishlisted={isWishlisted}
        wishlistLoading={wishlistLoading}
        toggleWishlist={toggleWishlist}
        lastUpdated={listings?.[0]?.scrapedAt}
        onOpenAlertModal={() => setAlertModalOpen(true)}
        bestListingUrl={bestListingUrl}
      />

      {/* Section A: Comparison Table (Ranked Rows) */}
      <section id="sellers-matrix" className="space-y-6">
        <ComparisonTable
          listings={listings}
          marketAverage={marketAverage}
          bestListingId={bestListingId}
        />

        {/* Individual Listing Cards Grid */}
        {listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                isBestDeal={listing._id === bestListingId}
                savings={
                  highestPrice ? highestPrice - listing.price : 0
                }
                marketAverage={marketAverage}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section B: Price History Chart */}
      <section className="space-y-6">
        <PriceHistoryChart data={priceHistory} />
      </section>

      {/* Section C: Local Sellers Section (if present) */}
      {localSellers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text">
                Local Physical Storefronts
              </h2>
              <p className="text-xs text-muted">
                Available at verified local retail shops in your area
              </p>
            </div>
            <span className="font-mono text-xs text-signal">
              {localSellers.length} Verified Stores
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {localSellers.map((seller, idx) => (
              <LocalSellerCard key={seller._id || idx} seller={seller} />
            ))}
          </div>
        </section>
      )}

      {/* Section D: Hardware Specifications & Features Chips */}
      <section className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Specs Table */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-text border-b border-line pb-3">
            Technical Specifications
          </h2>

          {product.specifications &&
          Object.keys(product.specifications).length > 0 ? (
            <div className="border border-line rounded-lg overflow-hidden bg-surface">
              <dl className="divide-y divide-line text-sm">
                {Object.entries(product.specifications).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-surface-2/40 transition-colors"
                    >
                      <dt className="font-mono text-xs uppercase tracking-wider text-muted">
                        {key}
                      </dt>
                      <dd className="mt-1 text-text sm:col-span-2 sm:mt-0 font-medium">
                        {val}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            </div>
          ) : (
            <p className="text-xs font-mono text-muted py-4">
              Standard manufacturer specifications apply.
            </p>
          )}
        </div>

        {/* Feature Tags */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-text border-b border-line pb-3">
            Engineered Capabilities
          </h2>

          {product.features?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-md bg-surface-2 border border-line text-xs font-mono text-text flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                  {feat}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-muted py-4">
              No custom feature flags defined.
            </p>
          )}
        </div>
      </section>

      {/* Section E: Reviews Section */}
      <section>
        <ReviewSection productId={id} />
      </section>

      {/* Section F: Related Products Grid */}
      <section>
        <RelatedProducts products={relatedProducts} />
      </section>

      {/* Price Alert Modal with Slider & Percentage Preview */}
      <Modal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title="Deploy Price Drop Monitor"
        description="Set a target rate. We will track every merchant and notify you the moment the price dips."
        maxWidth="max-w-md"
      >
        <form onSubmit={createAlert} className="space-y-5 pt-2">
          <div className="bg-surface-2/50 border border-line rounded-lg p-3 text-xs space-y-1">
            <div className="flex justify-between text-muted font-mono">
              <span>Current Best Index:</span>
              <span className="font-bold text-text">
                ₹{lowestPrice?.toLocaleString("en-IN") || "—"}
              </span>
            </div>
          </div>

          <FormField
            label="Target Desired Price (₹)"
            hint="Must be less than current index"
            required
          >
            <Input
              type="number"
              placeholder="e.g. 45000"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
            />
          </FormField>

          {/* Quick Percentage Slider / Steppers */}
          {lowestPrice && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-muted uppercase block">
                Quick Discount Presets:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((pct) => {
                  const presetPrice = Math.round(
                    lowestPrice * (1 - pct / 100)
                  );
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTargetPrice(presetPrice.toString())}
                      className="px-2 py-1 text-xs font-mono rounded border border-line bg-surface-2 hover:border-signal hover:text-signal transition-colors text-center cursor-pointer"
                    >
                      -{pct}%
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {alertDiffPercentage && (
            <div className="p-2.5 rounded bg-drop/10 border border-drop/30 text-xs font-mono text-drop flex items-center justify-between">
              <span>Savings vs Current:</span>
              <span className="font-bold">
                -{alertDiffPercentage}% (₹
                {(
                  lowestPrice - Number(targetPrice)
                ).toLocaleString("en-IN")}
                )
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAlertModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="signal"
              size="sm"
              loading={alertSubmitting}
            >
              Set Active Alert
            </Button>
          </div>
        </form>
      </Modal>

      {/* Mobile Sticky Buy Bar (Visible on mobile viewports only) */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-surface/95 backdrop-blur-lg border-t border-line p-3 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] font-mono text-muted uppercase block">
            Lowest Index
          </span>
          <span className="font-mono text-lg font-bold text-signal tabular-nums">
            ₹{lowestPrice?.toLocaleString("en-IN") || "—"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Bell}
            onClick={() => setAlertModalOpen(true)}
            aria-label="Set alert"
          />
          {bestListingUrl ? (
            <a
              href={bestListingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="signal" size="sm">
                Get Deal
              </Button>
            </a>
          ) : (
            <Button
              variant="signal"
              size="sm"
              onClick={() => {
                const el = document.getElementById("sellers-matrix");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Deals
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;