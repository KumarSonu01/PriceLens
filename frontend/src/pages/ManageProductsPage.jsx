import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  PackagePlus,
  DownloadCloud,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Layers,
  LayoutGrid,
  List,
  Cpu,
  HardDrive,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import DataTable from "../components/ui/DataTable";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";

const CATEGORIES = [
  "All",
  "Mobile",
  "Laptop",
  "Tablet",
  "Headphones",
  "Smartwatch",
  "Television",
  "Camera",
  "Gaming",
  "Accessories",
];

const ManageProductsPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load catalog products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/products/${productToDelete._id}`);

      setProducts((prev) =>
        prev.filter((p) => p._id !== productToDelete._id)
      );
      toast.success("Product removed from catalog");
      setProductToDelete(null);
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Table columns definition
  const columns = [
    {
      key: "title",
      header: "Product Hardware",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 max-w-md">
          <div className="w-12 h-12 rounded-lg bg-surface-2 border border-line flex items-center justify-center shrink-0 overflow-hidden p-1">
            <img
              src={row?.images?.[0] || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200"}
              alt={row.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200";
              }}
            />
          </div>
          <div className="min-w-0">
            <Link
              to={`/product/${row._id}`}
              className="font-bold text-sm text-text hover:text-signal transition-colors line-clamp-1 block"
            >
              {row.title}
            </Link>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
              <span className="font-semibold uppercase font-mono text-[11px] text-muted">
                {row.brand}
              </span>
              <span>•</span>
              <span className="font-mono text-[11px] text-muted/80">
                ID: {row._id.slice(-6)}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (row) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.category || "Unassigned"}
        </Badge>
      ),
    },
    {
      key: "specifications",
      header: "Hardware Specs",
      render: (row) => (
        <div className="flex flex-wrap gap-1.5 text-xs font-mono text-muted">
          {row.specifications?.RAM && (
            <span className="bg-surface-2 px-2 py-0.5 rounded border border-line flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              {row.specifications.RAM}
            </span>
          )}
          {row.specifications?.Storage && (
            <span className="bg-surface-2 px-2 py-0.5 rounded border border-line flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {row.specifications.Storage}
            </span>
          )}
          {!row.specifications?.RAM && !row.specifications?.Storage && (
            <span className="text-muted/60">—</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/product/${row._id}`}
            title="View live product"
            className="p-1.5 rounded-md hover:bg-surface-2 text-muted hover:text-text transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/edit-product/${row._id}`)}
            icon={Edit3}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setProductToDelete(row)}
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
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted">
            <Layers className="w-4 h-4 text-signal" />
            <span>Master Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text mt-1">
            Manage <span className="font-serif italic font-normal text-muted">Products</span>
          </h1>
          <p className="text-sm text-muted mt-1">
            Search, edit specifications, or delete devices from the multi-merchant matching index.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/import-product")}
            icon={DownloadCloud}
          >
            Import URL
          </Button>
          <Button
            variant="signal"
            size="sm"
            onClick={() => navigate("/admin/add-product")}
            icon={PackagePlus}
          >
            Add Hardware
          </Button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-surface border border-line rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by title or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-48">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* View Toggle & Summary Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto">
          <span className="text-xs font-mono text-muted">
            Showing <strong className="text-text">{filteredProducts.length}</strong> of {products.length}
          </span>

          <div className="flex items-center border border-line rounded-lg p-0.5 bg-surface-2">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-surface text-text shadow-xs"
                  : "text-muted hover:text-text"
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-surface text-text shadow-xs"
                  : "text-muted hover:text-text"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description={
            searchQuery || selectedCategory !== "All"
              ? "No catalog items matched your current filters. Try resetting search query or category."
              : "Your catalog is currently empty. Add your first product or import from retailer URLs."
          }
          actionLabel="Add New Product"
          onAction={() => navigate("/admin/add-product")}
        />
      ) : viewMode === "table" ? (
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyField="_id"
          density="comfortable"
        />
      ) : (
        /* Visual Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-surface border border-line rounded-xl overflow-hidden flex flex-col justify-between hover:border-signal/50 transition-all duration-200 hover:-translate-y-0.5 shadow-xs"
            >
              <div>
                <div className="relative aspect-video bg-surface-2 border-b border-line flex items-center justify-center p-4">
                  <img
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400"}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="font-mono text-[10px] bg-surface/80 backdrop-blur-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-mono uppercase font-semibold text-signal">
                    {product.brand}
                  </span>
                  <h3 className="font-bold text-sm text-text line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono text-muted">
                    {product.specifications?.RAM && (
                      <span className="bg-surface-2 px-2 py-0.5 rounded border border-line">
                        {product.specifications.RAM}
                      </span>
                    )}
                    {product.specifications?.Storage && (
                      <span className="bg-surface-2 px-2 py-0.5 rounded border border-line">
                        {product.specifications.Storage}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-line/50 mt-4 flex items-center justify-between gap-2">
                <Link
                  to={`/product/${product._id}`}
                  className="text-xs font-mono text-muted hover:text-text flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View
                </Link>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                    icon={Edit3}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setProductToDelete(product)}
                    icon={Trash2}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Catalog Product"
        message={`Are you sure you want to permanently delete "${productToDelete?.title}"? All associated multi-merchant price listings will be orphaned or removed.`}
        confirmLabel="Delete Product"
        loading={deleting}
        variant="danger"
      />
    </div>
  );
};

export default ManageProductsPage;