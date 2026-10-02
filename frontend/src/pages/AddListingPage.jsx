import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Switch from "../components/ui/Switch";
import FormField from "../components/ui/FormField";
import ListingCard from "../components/listing/ListingCard";

const AddListingPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("Within 2 Hours");
  const [offer, setOffer] = useState("");
  const [stock, setStock] = useState(true);

  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setFetchingProducts(true);
        const { data } = await api.get("/products");
        setProducts(data.products || []);
      } catch (err) {
        console.log(err);
      } finally {
        setFetchingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p._id === productId) || null;
  }, [products, productId]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!productId) {
      toast.error("Please select a target hardware model");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Please provide a valid listing price");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const listingData = {
        product: productId,
        price: Number(price),
        deliveryInfo,
        offer,
        stock,
        source: "Local Seller",
      };

      await api.post("/listings", listingData);

      toast.success("Store listing published successfully");
      navigate("/seller/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to publish listing";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Construct mock listing for live preview card
  const previewListing = {
    _id: "preview-id",
    price: Number(price) || 0,
    deliveryInfo: deliveryInfo || "Within 2 Hours",
    offer: offer || "Standard store warranty",
    stock: stock,
    source: "Local Seller",
    seller: {
      shopName: "Your Store Name",
      storeLink: "https://yourstore.com",
    },
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-8 min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase">
            <Link to="/seller/dashboard" className="hover:text-text">
              Seller Hub
            </Link>
            <span>/</span>
            <span>New Inventory Listing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text mt-1">
            Publish Local Store Listing
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate("/seller/dashboard")}
        >
          Cancel
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3.5 bg-rise/10 border border-rise/30 rounded-md text-xs text-rise font-medium">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-6">
              {/* 1. Target Hardware SKU */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-signal uppercase tracking-wider block">
                  01 · Target Hardware Model
                </span>

                <FormField
                  label="Select Catalog Hardware"
                  hint="Choose from indexed models"
                  required
                >
                  <Select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                    disabled={fetchingProducts}
                  >
                    <option value="">
                      {fetchingProducts ? "Loading catalog..." : "Choose hardware SKU..."}
                    </option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title} ({p.brand})
                      </option>
                    ))}
                  </Select>
                </FormField>

                {selectedProduct && (
                  <div className="p-3 bg-surface-2/40 border border-line rounded-md flex items-center gap-3">
                    <img
                      src={selectedProduct.images?.[0] || "https://via.placeholder.com/60"}
                      alt={selectedProduct.title}
                      className="w-12 h-12 object-contain rounded bg-surface p-1 shrink-0 border border-line"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text truncate">
                        {selectedProduct.title}
                      </p>
                      <p className="text-[11px] font-mono text-muted">
                        Category: {selectedProduct.category} · Brand: {selectedProduct.brand}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Pricing */}
              <div className="space-y-3 pt-4 border-t border-line">
                <span className="text-xs font-mono text-signal uppercase tracking-wider block">
                  02 · Pricing & Currency
                </span>

                <FormField label="Your Landed Selling Price (₹)" required>
                  <Input
                    type="number"
                    placeholder="e.g. 48999"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="1"
                  />
                </FormField>
              </div>

              {/* 3. Fulfillment & In-Store Availability */}
              <div className="space-y-4 pt-4 border-t border-line">
                <span className="text-xs font-mono text-signal uppercase tracking-wider block">
                  03 · Fulfillment & Special Offers
                </span>

                <FormField
                  label="Fulfillment Timeline"
                  hint="e.g. 'Within 2 Hours', 'Same Day', or 'In-Store Pickup'"
                  required
                >
                  <Input
                    type="text"
                    placeholder="Within 2 Hours"
                    value={deliveryInfo}
                    onChange={(e) => setDeliveryInfo(e.target.value)}
                    required
                  />
                </FormField>

                <FormField
                  label="Value Add Offer (Optional)"
                  hint="e.g. 'Free Tempered Glass', '1 Year Extended Warranty'"
                >
                  <Input
                    type="text"
                    placeholder="Free Screen Guard + Fast Charger"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                  />
                </FormField>

                <div className="pt-2">
                  <Switch
                    checked={stock}
                    onChange={setStock}
                    id="stock-toggle"
                    label={stock ? "Units currently in stock" : "Currently out of stock"}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-6 border-t border-line flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate("/seller/dashboard")}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="signal"
                  size="md"
                  loading={loading}
                >
                  Publish Listing to Feed
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase">
            <Sparkles className="w-3.5 h-3.5 text-signal" />
            <span>Live Buyer View Simulation</span>
          </div>

          <div className="p-1 border border-dashed border-line rounded-lg bg-surface/50">
            <ListingCard
              listing={previewListing}
              isBestDeal={true}
              marketAverage={Number(price) ? Number(price) * 1.08 : 50000}
            />
          </div>
          <p className="text-[11px] font-mono text-muted text-center">
            This card represents how your offer will be ranked in the price comparison table.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddListingPage;