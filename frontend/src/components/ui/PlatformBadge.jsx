import { Store, ShoppingBag } from "lucide-react";
import { cn } from "../../lib/utils";

const PlatformBadge = ({ source = "Local", size = "md", className }) => {
  const norm = (source || "").toLowerCase().trim();

  const configs = {
    amazon: {
      name: "Amazon",
      img: "/amazon.png",
      tagClass: "bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/30",
    },
    flipkart: {
      name: "Flipkart",
      img: "/flipkart.png",
      tagClass: "bg-[#2874F0]/10 text-[#2874F0] border-[#2874F0]/30",
    },
    zepto: {
      name: "Zepto",
      icon: ShoppingBag,
      tagClass: "bg-[#FF3269]/10 text-[#FF3269] border-[#FF3269]/30",
    },
    blinkit: {
      name: "Blinkit",
      icon: ShoppingBag,
      tagClass: "bg-[#F8CB46]/10 text-[#F8CB46] border-[#F8CB46]/30",
    },
    local: {
      name: "Local Seller",
      icon: Store,
      tagClass: "bg-signal/10 text-signal border-signal/30",
    },
  };

  const current =
    configs[norm] ||
    (norm.includes("amazon")
      ? configs.amazon
      : norm.includes("flipkart")
      ? configs.flipkart
      : norm.includes("zepto")
      ? configs.zepto
      : norm.includes("blinkit")
      ? configs.blinkit
      : configs.local);

  const sizes = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  const imgSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const IconComponent = current.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border tracking-tight select-none",
        current.tagClass,
        sizes[size],
        className
      )}
    >
      {current.img ? (
        <img
          src={current.img}
          alt={current.name}
          className={cn(imgSizes[size], "object-contain shrink-0 rounded-xs")}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : IconComponent ? (
        <IconComponent className={cn(imgSizes[size], "shrink-0")} />
      ) : null}
      <span>{current.name}</span>
    </span>
  );
};

export default PlatformBadge;
