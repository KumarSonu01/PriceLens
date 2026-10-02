import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  DownloadCloud,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Layers,
  Edit,
  Globe,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FormField from "../components/ui/FormField";
import PlatformBadge from "../components/ui/PlatformBadge";
import Badge from "../components/ui/Badge";

const ImportProductPage = () => {
  const navigate = useNavigate();

  const [source, setSource] = useState("Flipkart");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [importedProduct, setImportedProduct] = useState(null);

  // Auto-detect source when URL changes
  const handleUrlChange = (value) => {
    setUrl(value);
    const lower = value.toLowerCase();
    if (lower.includes("amazon.in") || lower.includes("amzn.to") || lower.includes("amzn.in")) {
      setSource("Amazon");
    } else if (lower.includes("flipkart.com") || lower.includes("dl.flipkart.com")) {
      setSource("Flipkart");
    }
  };

  const importProduct = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please paste a valid product page URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setImportedProduct(null);

      const endpoint =
        source === "Amazon"
          ? "/admin/import/amazon"
          : "/admin/import/flipkart";

      const { data } = await api.post(endpoint, { url: url.trim() });

      if (data?.product) {
        setImportedProduct(data.product);
        toast.success(`Successfully imported: ${data.product.title}`);
        setUrl("");
      } else {
        toast.success("Product imported successfully!");
      }
    } catch (err) {
      console.error("Import product error:", err);
      const msg = err.response?.data?.message || "Product scraper failed. Please check the URL.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
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
            Import <span className="font-serif italic font-normal text-muted">Product</span>
          </h1>
          <p className="text-sm text-muted mt-1">
            Scrape live titles, specifications, and merchant price quotes directly from retail URLs.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/manage-products")}
          icon={Layers}
        >
          View Catalog
        </Button>
      </div>

      {/* Main Scraper Panel */}
      <div className="bg-surface border border-line rounded-xl p-6 sm:p-8 space-y-6">
        {/* Source Platform Selector */}
        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-muted mb-3">
            Target Platform
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSource("Flipkart")}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                source === "Flipkart"
                  ? "border-signal bg-signal/10 ring-1 ring-signal text-text"
                  : "border-line bg-surface-2/40 hover:bg-surface-2 text-muted hover:text-text"
              }`}
            >
              <div className="flex items-center gap-3">
                <PlatformBadge platform="Flipkart" />
                <div className="text-left">
                  <span className="font-bold text-sm block">Flipkart India</span>
                  <span className="text-[11px] font-mono text-muted">Direct Web Scraping</span>
                </div>
              </div>
              {source === "Flipkart" && (
                <CheckCircle2 className="w-5 h-5 text-signal" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setSource("Amazon")}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                source === "Amazon"
                  ? "border-signal bg-signal/10 ring-1 ring-signal text-text"
                  : "border-line bg-surface-2/40 hover:bg-surface-2 text-muted hover:text-text"
              }`}
            >
              <div className="flex items-center gap-3">
                <PlatformBadge platform="Amazon" />
                <div className="text-left">
                  <span className="font-bold text-sm block">Amazon.in</span>
                  <span className="text-[11px] font-mono text-muted">Direct ASIN Parsing</span>
                </div>
              </div>
              {source === "Amazon" && (
                <CheckCircle2 className="w-5 h-5 text-signal" />
              )}
            </button>
          </div>
        </div>

        {/* URL Form */}
        <form onSubmit={importProduct} className="space-y-4">
          <FormField
            label="Product Page URL"
            required
            helperText={`Paste a complete canonical product link from ${source === "Amazon" ? "amazon.in" : "flipkart.com"}. We will parse title, image, specs, and retail price.`}
          >
            <div className="relative">
              <Input
                type="url"
                placeholder={
                  source === "Amazon"
                    ? "https://www.amazon.in/dp/B0BDK62PDX"
                    : "https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm..."
                }
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                required
                className="pr-28 font-mono text-xs"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  {source}
                </Badge>
              </div>
            </div>
          </FormField>

          {error && (
            <div className="p-4 rounded-lg bg-rise/10 border border-rise/30 text-rise text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Scraping Unsuccessful</span>
                <span className="text-xs leading-relaxed">{error}</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-muted flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Scraper runs headlessly with server-side rate protection
            </span>

            <Button
              type="submit"
              variant="signal"
              disabled={loading}
              loading={loading}
              icon={loading ? Loader2 : DownloadCloud}
            >
              {loading ? `Importing from ${source}...` : `Import ${source} Product`}
            </Button>
          </div>
        </form>
      </div>

      {/* Success Result Card */}
      {importedProduct && (
        <div className="bg-surface border border-signal/40 rounded-xl p-6 sm:p-8 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-signal" />
              <h2 className="text-base font-bold text-text">
                Product Successfully Imported!
              </h2>
            </div>
            <PlatformBadge platform={source} />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-32 h-32 rounded-lg bg-surface-2 border border-line flex items-center justify-center p-2 shrink-0 overflow-hidden">
              <img
                src={
                  importedProduct.images?.[0] ||
                  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400"
                }
                alt={importedProduct.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono font-semibold uppercase text-signal">
                {importedProduct.brand || "Imported SKU"}
              </span>
              <h3 className="text-lg font-bold text-text line-clamp-2">
                {importedProduct.title}
              </h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {importedProduct.category && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {importedProduct.category}
                  </Badge>
                )}
                {importedProduct.specifications?.RAM && (
                  <span className="text-xs font-mono bg-surface-2 px-2 py-0.5 rounded text-muted">
                    RAM: {importedProduct.specifications.RAM}
                  </span>
                )}
                {importedProduct.specifications?.Storage && (
                  <span className="text-xs font-mono bg-surface-2 px-2 py-0.5 rounded text-muted">
                    Storage: {importedProduct.specifications.Storage}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-line flex flex-wrap items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/edit-product/${importedProduct._id}`)}
              icon={Edit}
            >
              Edit Specs
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/admin/manage-products")}
              icon={Layers}
            >
              View In Catalog
            </Button>
            <Link
              to={`/product/${importedProduct._id}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-signal hover:underline px-3 py-2"
            >
              Public Product Page
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Helper Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-surface border border-line text-xs space-y-1.5">
          <span className="font-bold text-text block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-signal" />
            Amazon India Tips
          </span>
          <p className="text-muted leading-relaxed">
            Ensure the URL includes the standard product path (e.g. <code>/dp/ASIN</code>). Affiliate tracking tags are automatically stripped.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-line text-xs space-y-1.5">
          <span className="font-bold text-text block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-signal" />
            Flipkart India Tips
          </span>
          <p className="text-muted leading-relaxed">
            Use desktop or mobile product URLs. PriceLens extracts live selling price, rating metadata, and default media assets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportProductPage;