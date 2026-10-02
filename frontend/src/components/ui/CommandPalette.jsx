import { useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Home,
  Scale,
  Heart,
  Bell,
  User,
  LayoutDashboard,
  PlusCircle,
  Package,
  Layers,
  Sun,
  Moon,
  UploadCloud,
  X,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");

  const handleSelect = (callback) => {
    onClose();
    callback();
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      onClose();
      navigate(`/search?keyword=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-surface border border-line rounded-lg shadow-2xl overflow-hidden z-10 text-text"
          >
            <Command
              value={query}
              onValueChange={setQuery}
              className="w-full flex flex-col"
            >
              <div className="flex items-center px-4 border-b border-line">
                <Search className="w-4 h-4 text-muted shrink-0 mr-3" />
                <Command.Input
                  placeholder="Type a command or search products..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !query.startsWith(">")) {
                      handleSearchSubmit();
                    }
                  }}
                  className="w-full bg-transparent py-3.5 text-sm text-text placeholder:text-muted/60 outline-none"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="text-muted hover:text-text p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Command.List className="max-h-80 overflow-y-auto p-2 text-sm">
                <Command.Empty className="p-6 text-center text-xs text-muted">
                  No matching command or shortcut found. Press Enter to search catalog.
                </Command.Empty>

                <Command.Group
                  heading="Navigation"
                  className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-1.5"
                >
                  <Command.Item
                    onSelect={() => handleSelect(() => navigate("/"))}
                    className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                  >
                    <Home className="w-4 h-4 text-muted" />
                    <span>Home & Catalog</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect(() => navigate("/compare"))}
                    className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                  >
                    <Scale className="w-4 h-4 text-muted" />
                    <span>Product Comparison</span>
                  </Command.Item>

                  {userInfo && (
                    <>
                      <Command.Item
                        onSelect={() => handleSelect(() => navigate("/wishlist"))}
                        className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                      >
                        <Heart className="w-4 h-4 text-muted" />
                        <span>Saved Wishlist</span>
                      </Command.Item>

                      <Command.Item
                        onSelect={() => handleSelect(() => navigate("/alerts"))}
                        className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                      >
                        <Bell className="w-4 h-4 text-muted" />
                        <span>Price Alerts</span>
                      </Command.Item>

                      <Command.Item
                        onSelect={() => handleSelect(() => navigate("/profile"))}
                        className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                      >
                        <User className="w-4 h-4 text-muted" />
                        <span>User Profile</span>
                      </Command.Item>
                    </>
                  )}
                </Command.Group>

                {/* Seller commands */}
                {(userInfo?.role === "local_seller" || userInfo?.role === "admin") && (
                  <Command.Group
                    heading="Seller Hub"
                    className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-1.5 mt-2"
                  >
                    <Command.Item
                      onSelect={() =>
                        handleSelect(() => navigate("/seller/dashboard"))
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted" />
                      <span>Seller Dashboard</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() =>
                        handleSelect(() => navigate("/seller/add-listing"))
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                    >
                      <PlusCircle className="w-4 h-4 text-muted" />
                      <span>Create New Listing</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() =>
                        handleSelect(() => navigate("/seller/manage-listings"))
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                    >
                      <Layers className="w-4 h-4 text-muted" />
                      <span>Manage Store Listings</span>
                    </Command.Item>
                  </Command.Group>
                )}

                {/* Admin commands */}
                {userInfo?.role === "admin" && (
                  <Command.Group
                    heading="Administration"
                    className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-1.5 mt-2"
                  >
                    <Command.Item
                      onSelect={() =>
                        handleSelect(() => navigate("/admin/dashboard"))
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted" />
                      <span>Admin Control Panel</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() =>
                        handleSelect(() => navigate("/admin/add-product"))
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                    >
                      <PlusCircle className="w-4 h-4 text-muted" />
                      <span>Add Catalog Product</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() =>
                        handleSelect(() => navigate("/admin/import-product"))
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                    >
                      <UploadCloud className="w-4 h-4 text-muted" />
                      <span>Import from Flipkart / Amazon</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() =>
                        handleSelect(() => navigate("/admin/manage-products"))
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                    >
                      <Package className="w-4 h-4 text-muted" />
                      <span>Manage All Products</span>
                    </Command.Item>
                    <Command.Item
                      onSelect={() =>
                        handleSelect(() => navigate("/admin/listings"))
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                    >
                      <Layers className="w-4 h-4 text-muted" />
                      <span>All Platform Listings</span>
                    </Command.Item>
                  </Command.Group>
                )}

                <Command.Group
                  heading="Preferences"
                  className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-1.5 mt-2"
                >
                  <Command.Item
                    onSelect={() => handleSelect(() => toggleTheme())}
                    className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-surface-2 transition-colors data-[selected=true]:bg-surface-2"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 text-warn" />
                    ) : (
                      <Moon className="w-4 h-4 text-muted" />
                    )}
                    <span>Switch to {theme === "dark" ? "Light 'Paper'" : "Dark Terminal"} Theme</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="px-4 py-2 border-t border-line text-[11px] text-muted flex items-center justify-between bg-surface-2/40">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-[10px]">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-[10px] ml-1">
                      ↓
                    </kbd>{" "}
                    to navigate
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-[10px]">
                      Enter
                    </kbd>{" "}
                    to select
                  </span>
                </div>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-[10px]">
                    Esc
                  </kbd>{" "}
                  to close
                </span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
