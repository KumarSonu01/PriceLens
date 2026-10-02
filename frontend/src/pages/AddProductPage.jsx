import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackagePlus,
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Info,
  Cpu,
  HardDrive,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import FormField from "../components/ui/FormField";
import Badge from "../components/ui/Badge";

const CATEGORIES = [
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

const AddProductPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [features, setFeatures] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedFeatures = features
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!title.trim() || !brand.trim() || !category || !image.trim()) {
      setError("Please fill in all required fields (Title, Brand, Category, Image URL).");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const productData = {
        title: title.trim(),
        brand: brand.trim(),
        category,
        description: description.trim(),
        images: [image.trim()],
        specifications: {
          RAM: ram.trim(),
          Storage: storage.trim(),
        },
        features: parsedFeatures,
      };

      await api.post("/products", productData);

      toast.success("Product registered in PriceLens catalog!");
      navigate("/admin/manage-products");
    } catch (err) {
      console.error("Add product error:", err);
      const msg = err.response?.data?.message || "Failed to create product.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Breadcrumb */}
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
            Add New <span className="font-serif italic font-normal text-muted">Product</span>
          </h1>
          <p className="text-sm text-muted mt-1">
            Publish a new device into the universal price-matching catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/manage-products")}
          >
            Catalog Directory
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/admin/import-product")}
          >
            Switch to Auto-Import
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rise/10 border border-rise/30 text-rise text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-xs font-bold underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (Left) */}
        <form
          onSubmit={submitHandler}
          className="lg:col-span-7 bg-surface border border-line rounded-xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center gap-2 pb-4 border-b border-line">
            <PackagePlus className="w-5 h-5 text-signal" />
            <h2 className="text-base font-bold text-text">Product Metadata</h2>
          </div>

          <div className="space-y-4">
            <FormField label="Product Title" required helperText="Include brand, model, and primary spec (e.g. Apple iPhone 15 Pro 128GB Titanium)">
              <Input
                type="text"
                placeholder="e.g. Samsung Galaxy S24 Ultra"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Brand" required>
                <Input
                  type="text"
                  placeholder="e.g. Apple, Sony, Samsung"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Category" required>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField label="Description" required helperText="Provide high-level marketing overview or key technical highlights.">
              <Textarea
                rows={4}
                placeholder="Write a clear summary of the product..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="RAM / Memory" helperText="e.g. 8GB, 16GB LPDDR5X">
                <Input
                  type="text"
                  placeholder="8GB"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                />
              </FormField>

              <FormField label="Storage Capacity" helperText="e.g. 256GB, 1TB NVMe">
                <Input
                  type="text"
                  placeholder="256GB"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                />
              </FormField>
            </div>

            <FormField
              label="Key Features"
              helperText="Enter comma-separated features (e.g. 120Hz AMOLED, 5000mAh Battery, Fast Charging)"
            >
              <Input
                type="text"
                placeholder="AMOLED, Snapdragon 8 Gen 3, IP68"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </FormField>

            <FormField
              label="Primary Image URL"
              required
              helperText="Direct image URL (HTTPS) displaying the product on clean background."
            >
              <Input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </FormField>
          </div>

          <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="signal"
              loading={loading}
              icon={PackagePlus}
            >
              {loading ? "Publishing..." : "Publish Product"}
            </Button>
          </div>
        </form>

        {/* Live Simulation Card (Right) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-surface border border-line rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-signal" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text">
                  Live Catalog Simulation
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted">Preview</span>
            </div>

            {/* Preview Card */}
            <div className="bg-surface-2/60 border border-line rounded-xl overflow-hidden shadow-xs">
              <div className="relative aspect-video sm:aspect-square w-full bg-surface-2 flex items-center justify-center overflow-hidden border-b border-line">
                {image ? (
                  <img
                    src={image}
                    alt={title || "Preview"}
                    className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted gap-2">
                    <ImageIcon className="w-10 h-10 stroke-[1.2]" />
                    <span className="text-xs font-mono">Image Preview</span>
                  </div>
                )}
                {category && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-surface/90 backdrop-blur-xs font-mono text-[10px]">
                      {category}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-semibold uppercase text-signal tracking-wide">
                    {brand || "Brand Name"}
                  </span>
                  <span className="text-xs font-mono text-muted">Catalog SKU</span>
                </div>

                <h3 className="text-base font-bold text-text leading-snug line-clamp-2">
                  {title || "Product title will appear here"}
                </h3>

                <p className="text-xs text-muted leading-relaxed line-clamp-3">
                  {description || "Provide an engaging description so buyers understand technical specifications and warranty parameters."}
                </p>

                {(ram || storage) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {ram && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-surface border border-line px-2 py-0.5 rounded text-text">
                        <Cpu className="w-3 h-3 text-muted" />
                        {ram}
                      </span>
                    )}
                    {storage && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-surface border border-line px-2 py-0.5 rounded text-text">
                        <HardDrive className="w-3 h-3 text-muted" />
                        {storage}
                      </span>
                    )}
                  </div>
                )}

                {parsedFeatures.length > 0 && (
                  <div className="pt-2 border-t border-line/60">
                    <span className="text-[10px] font-mono uppercase text-muted block mb-1.5">
                      Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedFeatures.slice(0, 4).map((f, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-signal/10 border border-signal/30 text-signal font-mono px-2 py-0.5 rounded-full"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Guidelines Card */}
            <div className="p-4 rounded-lg bg-surface-2/40 border border-line space-y-2 text-xs text-muted">
              <div className="flex items-center gap-2 text-text font-semibold">
                <Info className="w-4 h-4 text-signal" />
                <span>Catalog Guidelines</span>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Titles should match retailer naming for optimal fuzzy matching.</li>
                <li>Ensure images are hosted on HTTPS with minimal watermarks.</li>
                <li>Once created, sellers can attach competitive price quotes to this product.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;