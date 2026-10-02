import { Store, MapPin, Phone, ExternalLink } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const LocalSellerCard = ({ seller }) => {
  if (!seller) return null;

  return (
    <Card hoverable className="p-5 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-signal/15 text-signal flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-base text-text tracking-tight truncate">
            {seller.shopName || "Local Retailer"}
          </h3>
        </div>

        <div className="space-y-1.5 text-xs text-muted">
          {seller.city && (
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-signal" />
              <span>{seller.city}</span>
            </p>
          )}

          {seller.phone && (
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 shrink-0 text-muted" />
              <span className="font-mono">{seller.phone}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-line">
        {seller.storeLink ? (
          <a
            href={seller.storeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="secondary" size="sm" className="w-full" icon={ExternalLink}>
              Visit Local Store
            </Button>
          </a>
        ) : (
          <Button variant="outline" size="sm" disabled className="w-full opacity-50">
            In-Store Purchase
          </Button>
        )}
      </div>
    </Card>
  );
};

export default LocalSellerCard;