import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Trash2, CheckCircle2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Skeleton from "../components/ui/Skeleton";

const AlertsPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/alerts/my-alerts");
      setAlerts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load active price alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/alerts/${deleteId}`);
      setAlerts((prev) => prev.filter((a) => a._id !== deleteId));
      toast.success("Price alert decommissioned");
      setDeleteModalOpen(false);
    } catch {
      toast.error("Failed to delete alert");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const { activeAlerts, triggeredAlerts } = useMemo(() => {
    const active = [];
    const triggered = [];
    alerts.forEach((alert) => {
      if (alert.isTriggered) {
        triggered.push(alert);
      } else {
        active.push(alert);
      }
    });
    return { activeAlerts: active, triggeredAlerts: triggered };
  }, [alerts]);

  const renderAlertCard = (alert) => {
    const product = alert.product;
    if (!product) return null;

    const currentPrice = product.lowestPrice || 0;
    const targetPrice = alert.targetPrice || 0;

    // Progress percentage towards target
    const progress =
      currentPrice && targetPrice
        ? Math.min(100, Math.round((targetPrice / currentPrice) * 100))
        : 50;

    return (
      <Card key={alert._id} className="p-5 flex flex-col justify-between">
        <div className="flex gap-4 items-start">
          <div className="w-20 h-20 bg-surface-2/40 border border-line rounded-md p-2 flex items-center justify-center shrink-0">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/100"}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase text-muted truncate">
                {product.brand}
              </span>
              <Badge
                variant={alert.isTriggered ? "signal" : "neutral"}
                size="sm"
              >
                {alert.isTriggered ? "● TRIGGERED" : "ACTIVE"}
              </Badge>
            </div>

            <Link to={`/product/${product._id}`}>
              <h3 className="font-bold text-sm text-text line-clamp-1 hover:text-signal transition-colors">
                {product.title}
              </h3>
            </Link>

            <div className="flex items-baseline gap-4 pt-1 text-xs font-mono">
              <div>
                <span className="text-muted block text-[10px] uppercase">
                  Target Price
                </span>
                <span className="font-bold text-signal">
                  ₹{targetPrice.toLocaleString("en-IN")}
                </span>
              </div>
              {currentPrice > 0 && (
                <div>
                  <span className="text-muted block text-[10px] uppercase">
                    Current Best
                  </span>
                  <span className="font-semibold text-text">
                    ₹{currentPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar towards Target */}
        <div className="mt-4 pt-3 border-t border-line/60 space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-muted">
            <span>Threshold Proximity</span>
            <span>{progress}% of current</span>
          </div>
          <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden border border-line">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                alert.isTriggered ? "bg-signal" : "bg-muted"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : "Active"}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDeleteId(alert._id);
                setDeleteModalOpen(true);
              }}
              title="Delete alert"
              className="p-1.5 rounded text-muted hover:text-rise transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <Link to={`/product/${product._id}`}>
              <Button variant="secondary" size="sm">
                View Deals
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton className="w-48 h-8 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="w-full h-56 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-8 min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase">
            <Link to="/" className="hover:text-text">
              Catalog
            </Link>
            <span>/</span>
            <span>Surveillance Monitors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text mt-1">
            Autonomous Price Alerts
          </h1>
        </div>

        <span className="font-mono text-xs px-2.5 py-1 rounded bg-surface-2 border border-line text-signal font-bold tabular-nums">
          {alerts.length} Total Monitors
        </span>
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Active Price Monitors"
          description="Create a price alert on any product page. When market listings drop below your specified rate, an instant notification will trigger here."
          actionLabel="Browse Catalog Deals"
          onAction={() => navigate("/")}
        />
      ) : (
        <div className="space-y-10">
          {/* Triggered Alerts Group */}
          {triggeredAlerts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-line pb-2">
                <CheckCircle2 className="w-4 h-4 text-signal" />
                <h2 className="text-lg font-bold text-text tracking-tight font-mono">
                  Triggered Deals ({triggeredAlerts.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triggeredAlerts.map(renderAlertCard)}
              </div>
            </div>
          )}

          {/* Active Alerts Group */}
          {activeAlerts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-line pb-2">
                <Clock className="w-4 h-4 text-muted" />
                <h2 className="text-lg font-bold text-text tracking-tight font-mono">
                  Pending Surveillance Monitors ({activeAlerts.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAlerts.map(renderAlertCard)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Decommission Price Monitor"
        message="Are you sure you want to remove this price alert? You will no longer receive price dip notifications for this product."
        confirmLabel="Decommission"
        loading={deleting}
      />
    </div>
  );
};

export default AlertsPage;