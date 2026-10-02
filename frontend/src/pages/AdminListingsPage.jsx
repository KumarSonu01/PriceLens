import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Trash2,
  ExternalLink,
  Store,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import PriceTag from "../components/ui/PriceTag";
import PlatformBadge from "../components/ui/PlatformBadge";
import DataTable from "../components/ui/DataTable";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";

const AdminListingsPage = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [density, setDensity] = useState("comfortable");

  // Deletion modal state
  const [listingToDelete, setListingToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/listings/admin/all");
      setListings(data.listings || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load platform listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/listings/${listingToDelete._id}`);

      setListings((prev) =>
        prev.filter((l) => l._id !== listingToDelete._id)
      );
      toast.success("Listing offer removed");
      setListingToDelete(null);
    } catch (error) {
      console.error("Delete listing error:", error);
      toast.error(error.response?.data?.message || "Failed to delete listing");
    } finally {
      setDeleting(false);
    }
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const title = listing?.product?.title || "";
      const sellerName =
        listing?.seller?.shopName ||
        listing?.seller?.name ||
        listing?.source ||
        "";

      const matchesSearch =
        !searchQuery ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sellerName.toLowerCase().includes(searchQuery.toLowerCase());

      const isAmazon =
        listing?.source?.toLowerCase() === "amazon" ||
        sellerName.toLowerCase().includes("amazon");
      const isFlipkart =
        listing?.source?.toLowerCase() === "flipkart" ||
        sellerName.toLowerCase().includes("flipkart");
      const isZepto =
        listing?.source?.toLowerCase() === "zepto" ||
        sellerName.toLowerCase().includes("zepto");
      const isLocal = !isAmazon && !isFlipkart && !isZepto;

      let matchesSource = true;
      if (sourceFilter === "Amazon") matchesSource = isAmazon;
      else if (sourceFilter === "Flipkart") matchesSource = isFlipkart;
      else if (sourceFilter === "Zepto") matchesSource = isZepto;
      else if (sourceFilter === "Local") matchesSource = isLocal;

      let matchesStock = true;
      if (stockFilter === "InStock") matchesStock = Boolean(listing.stock);
      else if (stockFilter === "OutOfStock") matchesStock = !listing.stock;

      return matchesSearch && matchesSource && matchesStock;
    });
  }, [listings, searchQuery, sourceFilter, stockFilter]);

  const columns = [
    {
      key: "product",
      header: "Product Hardware",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 max-w-sm">
          <div className="w-10 h-10 rounded-lg bg-surface-2 border border-line flex items-center justify-center shrink-0 overflow-hidden p-1">
            <img
              src={
                row?.product?.images?.[0] ||
                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200"
              }
              alt={row?.product?.title || "Product"}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200";
              }}
            />
          </div>
          <div className="min-w-0">
            {row?.product?._id ? (
              <Link
                to={`/product/${row.product._id}`}
                className="font-bold text-sm text-text hover:text-signal transition-colors line-clamp-1 block"
              >
                {row?.product?.title || "Untitled Product"}
              </Link>
            ) : (
              <span className="font-semibold text-sm text-text line-clamp-1 block">
                {row?.product?.title || "Unlinked Product"}
              </span>
            )}
            <span className="text-[11px] font-mono text-muted block mt-0.5">
              ID: {row._id.slice(-6)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "seller",
      header: "Merchant / Source",
      render: (row) => {
        const sourceName = row?.source || row?.seller?.shopName || row?.seller?.name || "Local Seller";
        const isStandardPlatform = ["amazon", "flipkart", "zepto"].some((p) =>
          sourceName.toLowerCase().includes(p)
        );

        if (isStandardPlatform) {
          return <PlatformBadge platform={sourceName} />;
        }

        return (
          <div className="flex items-center gap-1.5 text-xs font-medium text-text">
            <Store className="w-3.5 h-3.5 text-signal" />
            <span className="truncate max-w-[140px]">{sourceName}</span>
          </div>
        );
      },
    },
    {
      key: "price",
      header: "Price Quote",
      sortable: true,
      render: (row) => (
        <PriceTag price={row.price} size="sm" />
      ),
    },
    {
      key: "stock",
      header: "Inventory Status",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-full border ${
            row.stock
              ? "bg-signal/10 border-signal/30 text-signal font-semibold"
              : "bg-surface-2 border-line text-muted"
          }`}
        >
          {row.stock ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              In Stock
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-muted" />
              Out of Stock
            </>
          )}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row?.product?._id && (
            <Link
              to={`/product/${row.product._id}`}
              title="Inspect product"
              className="p-1.5 rounded-md hover:bg-surface-2 text-muted hover:text-text transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => setListingToDelete(row)}
            icon={Trash2}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-text transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-text">
            All <span className="font-serif italic font-normal text-muted">Listings</span>
          </h1>
          <p className="text-sm text-muted mt-1">
            Global index of merchant price quotes scraped from online retailers and registered local sellers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchListings}
            icon={RefreshCw}
          >
            Refresh
          </Button>
          <Button
            variant="signal"
            size="sm"
            onClick={() => navigate("/admin/import-product")}
            icon={ShoppingBag}
          >
            Import Offer
          </Button>
        </div>
      </div>

      {/* Filter and Query Bar */}
      <div className="bg-surface border border-line rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search product or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Platform Source Filter */}
          <div className="w-full sm:w-44">
            <Select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Channels</option>
              <option value="Amazon">Amazon.in</option>
              <option value="Flipkart">Flipkart</option>
              <option value="Zepto">Zepto</option>
              <option value="Local">Local Sellers</option>
            </Select>
          </div>

          {/* Stock Filter */}
          <div className="w-full sm:w-40">
            <Select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="text-xs"
            >
              <option value="All">All Inventory</option>
              <option value="InStock">In Stock Only</option>
              <option value="OutOfStock">Out of Stock</option>
            </Select>
          </div>
        </div>

        {/* Density & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto">
          <span className="text-xs font-mono text-muted">
            Showing <strong className="text-text">{filteredListings.length}</strong> of {listings.length}
          </span>

          <div className="flex items-center border border-line rounded-lg p-0.5 bg-surface-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setDensity("comfortable")}
              className={`px-2.5 py-1 rounded transition-colors ${
                density === "comfortable"
                  ? "bg-surface text-text shadow-xs font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              Comfortable
            </button>
            <button
              type="button"
              onClick={() => setDensity("compact")}
              className={`px-2.5 py-1 rounded transition-colors ${
                density === "compact"
                  ? "bg-surface text-text shadow-xs font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      {/* Listings Table Area */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      ) : filteredListings.length === 0 ? (
        <EmptyState
          title="No Merchant Listings Found"
          description={
            searchQuery || sourceFilter !== "All" || stockFilter !== "All"
              ? "No price listings match your current filters. Try resetting search criteria."
              : "No merchant listings are currently recorded in the system."
          }
          actionLabel="Import New Listing"
          onAction={() => navigate("/admin/import-product")}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredListings}
          keyField="_id"
          density={density}
        />
      )}

      {/* Delete Listing Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(listingToDelete)}
        onClose={() => setListingToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Merchant Listing"
        message={`Are you sure you want to remove the ₹${listingToDelete?.price?.toLocaleString()} price listing for "${listingToDelete?.product?.title || "this product"}"? This will update the best-deal calculation.`}
        confirmLabel="Remove Listing"
        loading={deleting}
        variant="danger"
      />
    </div>
  );
};

export default AdminListingsPage;