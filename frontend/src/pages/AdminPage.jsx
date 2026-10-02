import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PackagePlus,
  DownloadCloud,
  Layers,
  Store,
  Users,
  Bell,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import api from "../api/axios";
import Stat from "../components/ui/Stat";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";

const AdminPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalListings: 0,
    totalUsers: 0,
    totalSellers: 0,
    importedProducts: 0,
    totalAlerts: 0,
    activeAlerts: 0,
    triggeredAlerts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/admin/stats");
      setStats(data || {});
    } catch (err) {
      console.error("Admin stats fetch error:", err);
      setError(err?.response?.data?.message || "Failed to load dashboard analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalAlerts = stats.totalAlerts || (stats.activeAlerts + stats.triggeredAlerts) || 0;
  const activePercent = totalAlerts > 0 ? Math.round((stats.activeAlerts / totalAlerts) * 100) : 0;
  const triggeredPercent = totalAlerts > 0 ? 100 - activePercent : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Could not load Admin Dashboard"
          description={error}
          actionLabel="Try Again"
          onAction={fetchStats}
        />
      </div>
    );
  }

  const actionCards = [
    {
      title: "Add Product",
      description: "Manually register catalog hardware, specs, and default media.",
      icon: PackagePlus,
      to: "/admin/add-product",
      badge: "Manual Entry",
      accent: "hover:border-signal/70",
    },
    {
      title: "Import Product",
      description: "Scrape and sync live pricing data from Amazon or Flipkart URLs.",
      icon: DownloadCloud,
      to: "/admin/import-product",
      badge: "Automated",
      accent: "hover:border-signal/70",
    },
    {
      title: "Manage Catalog",
      description: "Edit specs, refresh metadata, or prune inactive catalog devices.",
      icon: Layers,
      to: "/admin/manage-products",
      badge: `${stats.totalProducts} devices`,
      accent: "hover:border-signal/70",
    },
    {
      title: "Live Listings",
      description: "Inspect multi-merchant prices, stock counts, and platform flags.",
      icon: ShoppingBag,
      to: "/admin/listings",
      badge: `${stats.totalListings} offers`,
      accent: "hover:border-signal/70",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted">
            <ShieldCheck className="w-4 h-4 text-signal" />
            <span>Mission Control</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text mt-1">
            Admin <span className="font-serif italic font-normal text-muted">Dashboard</span>
          </h1>
          <p className="text-sm text-muted mt-1 max-w-xl">
            Real-time telemetry across multi-merchant catalog, scraper activity, subscriber alerts, and registered sellers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            icon={RefreshCw}
            className="hover:border-line-2"
          >
            Refresh Data
          </Button>
          <Button
            variant="signal"
            size="sm"
            onClick={() => navigate("/admin/import-product")}
            icon={DownloadCloud}
          >
            Quick Import
          </Button>
        </div>
      </div>

      {/* Top Telemetry Strip */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
          Platform Telemetry
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat
            label="Total Products"
            value={stats.totalProducts}
            description="Active catalog hardware"
          />
          <Stat
            label="Total Listings"
            value={stats.totalListings}
            description="Tracked seller offers"
          />
          <Stat
            label="Registered Sellers"
            value={stats.totalSellers}
            description="Verified shop merchants"
          />
          <Stat
            label="Total Users"
            value={stats.totalUsers}
            description="Buyers & account holders"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat
            label="Scraped & Imported"
            value={stats.importedProducts}
            description="Via Amazon / Flipkart scrapers"
          />
          <Stat
            label="Total Price Alerts"
            value={stats.totalAlerts}
            description="User target subscriptions"
          />
          <Stat
            label="Active Alert Monitors"
            value={stats.activeAlerts}
            description="Awaiting drop threshold"
          />
          <Stat
            label="Triggered Alerts"
            value={stats.triggeredAlerts}
            description="Target hit & notified"
          />
        </div>
      </div>

      {/* Alert Health & Distribution */}
      <div className="bg-surface border border-line rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-signal" />
              <h3 className="text-sm font-semibold text-text uppercase tracking-wide font-mono">
                Price Alert Pipeline Health
              </h3>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Breakdown of pending price drops versus successfully triggered alert notifications.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 text-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-signal" />
              Active ({stats.activeAlerts})
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-rise" />
              Triggered ({stats.triggeredAlerts})
            </span>
          </div>
        </div>

        {/* Distribution Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-surface-2 rounded-full overflow-hidden flex border border-line/60">
            <div
              style={{ width: `${activePercent}%` }}
              className="bg-signal transition-all duration-700 ease-out"
              title={`Active: ${activePercent}%`}
            />
            <div
              style={{ width: `${triggeredPercent}%` }}
              className="bg-rise/80 transition-all duration-700 ease-out"
              title={`Triggered: ${triggeredPercent}%`}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-muted">
            <span>{activePercent}% Pending Threshold</span>
            <span>{triggeredPercent}% Delivered</span>
          </div>
        </div>
      </div>

      {/* Action Command Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
          Administrative Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.to}
                className={`group relative flex flex-col justify-between p-6 bg-surface border border-line rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${card.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-surface-2 border border-line flex items-center justify-center text-text group-hover:text-signal group-hover:border-signal/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-surface-2 border border-line text-muted">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text group-hover:text-signal transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-line/50 flex items-center justify-between text-xs font-medium text-muted group-hover:text-text transition-colors">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-signal" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Status Summary Footnote */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-lg bg-surface-2/50 border border-line flex items-center gap-3">
          <Layers className="w-5 h-5 text-signal shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-text block">Multi-Store Catalog</span>
            <span className="text-muted">Amazon, Flipkart, Zepto, and verified neighborhood local shops.</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-surface-2/50 border border-line flex items-center gap-3">
          <Store className="w-5 h-5 text-signal shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-text block">Local Seller Network</span>
            <span className="text-muted">{stats.totalSellers} sellers active across 12+ city zones.</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-surface-2/50 border border-line flex items-center gap-3">
          <Users className="w-5 h-5 text-signal shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-text block">Security & Roles</span>
            <span className="text-muted">RBAC enforced with JWT tokens and Admin Passkey verification.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;