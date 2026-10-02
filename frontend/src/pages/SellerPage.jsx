import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Layers,
  PlusCircle,
  Store,
  ShieldCheck,
} from "lucide-react";
import api from "../api/axios";
import Stat from "../components/ui/Stat";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const SellerPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalListings: 0,
    activeDeals: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/listings/seller/stats");
      setStats(data || { totalProducts: 0, totalListings: 0, activeDeals: 0 });
    } catch (error) {
      console.log("Seller stats error:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-10 min-h-[80vh]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-signal uppercase tracking-wider mb-1">
            <Store className="w-3.5 h-3.5" />
            <span>LOCAL MERCHANT TERMINAL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
            Welcome back, {userInfo?.name}
          </h1>
          {userInfo?.shopName && (
            <p className="text-sm text-muted mt-1">
              Storefront: <strong className="text-text">{userInfo.shopName}</strong> {userInfo.city && `· ${userInfo.city}`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="signal"
            size="md"
            icon={PlusCircle}
            onClick={() => navigate("/seller/add-listing")}
          >
            Add Listing
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={Layers}
            onClick={() => navigate("/seller/manage-listings")}
          >
            Manage Inventory
          </Button>
        </div>
      </div>

      {/* KPI Cards Strip with Count-Up */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Stat
          label="Catalog Hardware Models"
          value={stats.totalProducts}
          description="Available for merchant listing"
        />
        <Stat
          label="Active Store Listings"
          value={stats.totalListings}
          description="Indexed in PriceLens feeds"
          trend="up"
        />
        <Stat
          label="Competitive Deals"
          value={stats.activeDeals}
          description="Priced at or below market average"
          trend="up"
        />
      </div>

      {/* Quick Action Tiles */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-text font-mono uppercase text-xs text-muted">
          Store Operations & Quick Actions
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            hoverable
            onClick={() => navigate("/seller/add-listing")}
            className="p-6 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-signal/15 text-signal flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text group-hover:text-signal transition-colors">
                Publish New SKU Listing
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Connect your store's price, warranty offer, and local delivery timeframe to any indexed product.
              </p>
            </div>
            <span className="text-xs font-mono text-signal flex items-center gap-1 pt-2">
              Launch Wizard →
            </span>
          </Card>

          <Card
            hoverable
            onClick={() => navigate("/seller/manage-listings")}
            className="p-6 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-2 border border-line text-text flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text group-hover:text-signal transition-colors">
                Inventory & Price Adjustments
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Update stock status in real-time or fine-tune pricing to win the "Best Deal" badge in your city.
              </p>
            </div>
            <span className="text-xs font-mono text-muted group-hover:text-text flex items-center gap-1 pt-2">
              Manage Items ({stats.totalListings}) →
            </span>
          </Card>

          <Card
            hoverable
            onClick={() => navigate("/profile")}
            className="p-6 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-2 border border-line text-text flex items-center justify-center group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text group-hover:text-signal transition-colors">
                Storefront Web Destination
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Configure your official WhatsApp catalog, website link, or Google Maps storefront redirect.
              </p>
            </div>
            <span className="text-xs font-mono text-muted group-hover:text-text flex items-center gap-1 pt-2">
              Update Profile Link →
            </span>
          </Card>
        </div>
      </div>

      {/* Seller Best Practices Banner */}
      <div className="border border-line rounded-lg p-6 bg-surface-2/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-signal" />
            <h3 className="font-bold text-sm text-text">
              Maximize In-Store Footfall
            </h3>
          </div>
          <p className="text-xs text-muted max-w-2xl leading-relaxed">
            Local buyers frequently check PriceLens to verify if a nearby shop can match online pricing with immediate same-day delivery. Keeping offers and stocks updated drives high-intent local store visits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;