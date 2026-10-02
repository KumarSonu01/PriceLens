import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layers,
  Edit2,
  Trash2,
  PlusCircle,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Switch from "../components/ui/Switch";
import PriceTag from "../components/ui/PriceTag";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Skeleton from "../components/ui/Skeleton";

const ManageListingsPage = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchFilter, setSearchFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // 'all' | 'in_stock' | 'out_of_stock'

  // Inline edit state
  const [editingListing, setEditingListing] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [formData, setFormData] = useState({
    price: "",
    stock: true,
    offer: "",
    deliveryInfo: "",
  });

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/listings/my-listings");
      setListings(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load your inventory listings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/listings/${deleteId}`);
      setListings((prev) => prev.filter((l) => l._id !== deleteId));
      toast.success("Listing removed from store catalog");
      setDeleteModalOpen(false);
    } catch {
      toast.error("Failed to delete listing");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const startEdit = (listing) => {
    setEditingListing(listing._id);
    setFormData({
      price: listing.price,
      stock: listing.stock,
      offer: listing.offer || "",
      deliveryInfo: listing.deliveryInfo || "",
    });
  };

  const cancelEdit = () => {
    setEditingListing(null);
  };

  const handleUpdateListing = async (id) => {
    try {
      setSavingEdit(true);
      await api.put(`/listings/${id}`, formData);
      toast.success("Listing parameters updated");
      setEditingListing(null);
      fetchListings();
    } catch {
      toast.error("Failed to update listing");
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const titleMatch = item.product?.title
        ?.toLowerCase()
        .includes(searchFilter.toLowerCase().trim());
      if (!titleMatch) return false;
      if (stockFilter === "in_stock") return item.stock === true;
      if (stockFilter === "out_of_stock") return item.stock === false;
      return true;
    });
  }, [listings, searchFilter, stockFilter]);

  if (loading) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Skeleton className="w-48 h-8 rounded-md" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-32 rounded-lg" />
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
            <Link to="/seller/dashboard" className="hover:text-text">
              Seller Hub
            </Link>
            <span>/</span>
            <span>Inventory Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text mt-1">
            Store Listings & Pricing Matrix
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-surface-2 border border-line text-signal font-bold tabular-nums">
            {listings.length} Active Listings
          </span>
          <Button
            variant="signal"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate("/seller/add-listing")}
          >
            Add New Listing
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-2/40 border border-line p-3 rounded-lg">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by product name..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-surface border border-line rounded-md pl-9 pr-3 py-1.5 text-xs text-text placeholder:text-muted/60 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted font-mono">Status:</span>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-surface text-text border border-line rounded-md px-3 py-1.5 text-xs font-medium outline-none cursor-pointer"
          >
            <option value="all">All Items</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Out of Stock Only</option>
          </select>
        </div>
      </div>

      {/* Listings List */}
      {filteredListings.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Inventory Listings Found"
          description={
            searchFilter
              ? "No SKU matches your search filter."
              : "You haven't listed any hardware products from the catalog yet."
          }
          actionLabel="Create First Listing"
          onAction={() => navigate("/seller/add-listing")}
        />
      ) : (
        <div className="space-y-4">
          {filteredListings.map((listing) => {
            const isEditing = editingListing === listing._id;
            const product = listing.product;

            return (
              <Card
                key={listing._id}
                className="p-5 border-line transition-all hover:border-text/25"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Product Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img
                      src={
                        product?.images?.[0] ||
                        "https://via.placeholder.com/100"
                      }
                      alt={product?.title || "Product"}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded bg-surface-2 p-1.5 shrink-0 border border-line"
                    />

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-muted">
                          {listing.source}
                        </span>
                        <span className="text-line">·</span>
                        <Badge
                          variant={listing.stock ? "drop" : "warn"}
                          size="sm"
                        >
                          {listing.stock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>

                      <Link to={`/product/${product?._id}`}>
                        <h3 className="font-bold text-sm sm:text-base text-text hover:text-signal transition-colors truncate">
                          {product?.title || "Catalog SKU"}
                        </h3>
                      </Link>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted font-mono pt-1">
                        <span>Fulfillment: {listing.deliveryInfo || "—"}</span>
                        {listing.offer && (
                          <span className="text-signal">
                            Offer: {listing.offer}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Pricing & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-line">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] font-mono text-muted uppercase block">
                        Landed Price
                      </span>
                      <PriceTag price={listing.price} size="md" highlight />
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Edit2}
                          onClick={() => startEdit(listing)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => {
                            setDeleteId(listing._id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Edit Form Panel */}
                {isEditing && (
                  <div className="mt-5 pt-4 border-t border-line space-y-4 bg-surface-2/40 p-4 rounded-md">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-signal font-bold">
                      Inline Inventory Modifier
                    </h4>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] font-mono text-muted block mb-1">
                          Selling Price (₹)
                        </label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-muted block mb-1">
                          Delivery Timeline
                        </label>
                        <Input
                          type="text"
                          value={formData.deliveryInfo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              deliveryInfo: e.target.value,
                            })
                          }
                          placeholder="e.g. Within 2 Hours"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-muted block mb-1">
                          Offer Description
                        </label>
                        <Input
                          type="text"
                          value={formData.offer}
                          onChange={(e) =>
                            setFormData({ ...formData, offer: e.target.value })
                          }
                          placeholder="e.g. Free Screen Guard"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                      <Switch
                        checked={formData.stock}
                        onChange={(val) =>
                          setFormData({ ...formData, stock: val })
                        }
                        id={`edit-stock-${listing._id}`}
                        label={formData.stock ? "Units In Stock" : "Marked Out of Stock"}
                      />

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                          disabled={savingEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="signal"
                          size="sm"
                          onClick={() => handleUpdateListing(listing._id)}
                          loading={savingEdit}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Remove Store Listing"
        message="Are you sure you want to delete this listing from PriceLens? Buyers will no longer see this offer in comparison tables."
        confirmLabel="Remove Listing"
        loading={deleting}
      />
    </div>
  );
};

export default ManageListingsPage;