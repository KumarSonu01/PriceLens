import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className,
  size = "md",
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center p-1 bg-surface-2 border border-line rounded-lg overflow-x-auto max-w-full",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-1.5 font-medium rounded-md text-xs sm:text-sm tracking-tight transition-colors cursor-pointer select-none whitespace-nowrap",
              isActive ? "text-[#0B0D0C] font-semibold" : "text-muted hover:text-text",
              size === "sm" && "px-3 py-1 text-xs"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                className="absolute inset-0 bg-signal rounded-md"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <tab.icon className="w-4 h-4 shrink-0" />}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-black/20 text-black"
                      : "bg-surface text-muted"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
