import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PriceTag from "../components/ui/PriceTag";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/wishlist");
      setWishlist(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Optimistic remove with undo toast
  const removeHandler = async (id) => {
    const itemToRemove = wishlist.find((item) => item._id === id);
    if (!itemToRemove) return;

    // Optimistically filter out
    setWishlist((prev) => prev.filter((item) => item._id !== id));

    let undone = false;

    toast(
      (t) => (
        <div className="flex items-center justify-between gap-3 w-full">
          <span className="text-xs">Removed from saved items</span>
          <button
            type="button"
            onClick={() => {
              undone = true;
              toast.dismiss(t.id);
              // Restore item
              setWishlist((prev) => [itemToRemove, ...prev]);
            }}
            className="text-xs font-bold text-signal underline cursor-pointer"
          >
            Undo
          </button>
        </div>
      ),
      { duration: 4000 }
    );

    // Call backend delete after slight delay if not undone
    setTimeout(async () => {
      if (!undone) {
        try {
          await api.delete(`/wishlist/${id}`);
        } catch {
          // restore if server delete failed
          setWishlist((prev) => [itemToRemove, ...prev]);
          toast.error("Could not remove item from server");
        }
      }
    }, 4500);
  };

  const sortedWishlist = useMemo(() => {
    return [...wishlist].sort((a, b) => {
      if (sortBy === "priceLow") {
        const aP = a.product?.lowestPrice || Infinity;
        const bP = b.product?.lowestPrice || Infinity;
        return aP - bP;
      }
      if (sortBy === "priceHigh") {
        const aP = a.product?.lowestPrice || 0;
        const bP = b.product?.lowestPrice || 0;
        return bP - aP;
      }
      return 0; // recent/default
    });
  }, [wishlist, sortBy]);

  if (loading) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton className="w-48 h-8 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-72 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-8 min-h-[80vh]">
      {/* Header and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase">
            <Link to="/" className="hover:text-text">
              Catalog
            </Link>
            <span>/</span>
            <span>Saved Hardware</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text mt-1">
            My Wishlist & Price Tracker
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-surface-2 border border-line text-signal font-bold tabular-nums">
            {wishlist.length} Items Saved
          </span>

          {wishlist.length > 1 && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface text-text border border-line rounded-md px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-signal/80 cursor-pointer"
            >
              <option value="recent">Recently Added</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          )}
        </div>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save products while browsing to keep track of their live market rates, historical drops, and seller availability."
          actionLabel="Explore Market Deals"
          onAction={() => navigate("/")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWishlist.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <Card
                key={item._id}
                hoverable
                className="p-5 flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="relative w-full h-52 bg-surface-2/40 border border-line/60 rounded-md p-4 flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src={
                        product.images?.[0] ||
                        "https://via.placeholder.com/300"
                      }
                      alt={product.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => removeHandler(item._id)}
                      title="Remove from wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 border border-line flex items-center justify-center text-muted hover:text-rise transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                    {product.brand}
                  </p>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-sm sm:text-base text-text line-clamp-2 hover:text-signal transition-colors min-h-[40px]">
                      {product.title}
                    </h3>
                  </Link>
                </div>

                <div className="mt-5 pt-4 border-t border-line/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-muted block mb-0.5">
                      Lowest Index
                    </span>
                    <PriceTag price={product.lowestPrice} size="sm" highlight />
                  </div>

                  <Link to={`/product/${product._id}`}>
                    <Button variant="secondary" size="sm" icon={ArrowRight}>
                      View Deals
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;