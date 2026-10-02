import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit3,
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Cpu,
  HardDrive,
  ExternalLink,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import FormField from "../components/ui/FormField";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";

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

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [features, setFeatures] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/products/${id}`);

        setTitle(data.title || "");
        setBrand(data.brand || "");
        setCategory(data.category || "");
        setDescription(data.description || "");
        setRam(data?.specifications?.RAM || "");
        setStorage(data?.specifications?.Storage || "");
        setFeatures(data.features?.join(", ") || "");
        setImage(data?.images?.[0] || "");
        setIsDirty(false);
      } catch (err) {
        console.error("Fetch product error:", err);
        setError("Failed to load product details for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const parsedFeatures = features
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!title.trim() || !brand.trim() || !category || !image.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        title: title.trim(),
        brand: brand.trim(),
        category,
        description: description.trim(),
        specifications: {
          RAM: ram.trim(),
          Storage: storage.trim(),
        },
        features: parsedFeatures,
        images: [image.trim()],
      };

      await api.put(`/products/${id}`, updateData);

      setIsDirty(false);
      toast.success("Product updated successfully");
      navigate("/admin/manage-products");
    } catch (err) {
      console.error("Update product error:", err);
      toast.error(err?.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (setter) => (e) => {
    setter(e.target.value);
    setIsDirty(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Skeleton className="lg:col-span-7 h-[600px] rounded-xl" />
          <Skeleton className="lg:col-span-5 h-[450px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Product Not Found"
          description={error}
          actionLabel="Back to Products"
          onAction={() => navigate("/admin/manage-products")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/manage-products")}
            className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-text transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Catalog
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-text">
              Edit <span className="font-serif italic font-normal text-muted">Product</span>
            </h1>
            {isDirty && (
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-signal/15 text-signal border border-signal/30">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-sm text-muted mt-1">
            Updating catalog item <span className="font-mono text-text">#{id.slice(-6)}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/manage-products")}
          >
            Cancel
          </Button>
          <Button
            variant="signal"
            size="sm"
            onClick={submitHandler}
            loading={saving}
            icon={Save}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (Left) */}
        <form
          onSubmit={submitHandler}
          className="lg:col-span-7 bg-surface border border-line rounded-xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-signal" />
              <h2 className="text-base font-bold text-text">Hardware Details</h2>
            </div>
            <a
              href={`/product/${id}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-muted hover:text-text inline-flex items-center gap-1"
            >
              Public Page
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-4">
            <FormField label="Product Title" required>
              <Input
                type="text"
                value={title}
                onChange={handleFieldChange(setTitle)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Brand" required>
                <Input
                  type="text"
                  value={brand}
                  onChange={handleFieldChange(setBrand)}
                  required
                />
              </FormField>

              <FormField label="Category" required>
                <Select
                  value={category}
                  onChange={handleFieldChange(setCategory)}
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

            <FormField label="Description" required>
              <Textarea
                rows={4}
                value={description}
                onChange={handleFieldChange(setDescription)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="RAM / Memory">
                <Input
                  type="text"
                  placeholder="8GB"
                  value={ram}
                  onChange={handleFieldChange(setRam)}
                />
              </FormField>

              <FormField label="Storage Capacity">
                <Input
                  type="text"
                  placeholder="256GB"
                  value={storage}
                  onChange={handleFieldChange(setStorage)}
                />
              </FormField>
            </div>

            <FormField
              label="Key Features"
              helperText="Comma-separated feature tags"
            >
              <Input
                type="text"
                placeholder="AMOLED, Fast Charging, IP68"
                value={features}
                onChange={handleFieldChange(setFeatures)}
              />
            </FormField>

            <FormField label="Primary Image URL" required>
              <Input
                type="url"
                value={image}
                onChange={handleFieldChange(setImage)}
                required
              />
            </FormField>
          </div>

          <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/manage-products")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="signal"
              loading={saving}
              icon={Save}
            >
              {saving ? "Saving..." : "Update Product"}
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
                  <span className="text-xs font-mono text-muted">SKU #{id.slice(-6)}</span>
                </div>

                <h3 className="text-base font-bold text-text leading-snug line-clamp-2">
                  {title || "Product title will appear here"}
                </h3>

                <p className="text-xs text-muted leading-relaxed line-clamp-3">
                  {description || "No description provided."}
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

            <div className="p-4 rounded-lg bg-surface-2/40 border border-line text-xs text-muted">
              <span className="text-text font-semibold block mb-1">
                Sync Note:
              </span>
              Editing this product updates its public comparison page instantly while preserving all historical price charts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;