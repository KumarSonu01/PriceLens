import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Heart,
  Bell,
  Sun,
  Moon,
  Command as CmdIcon,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  Scale,
  History,
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import { useCompare } from "../../features/compare/CompareContext";
import api from "../../api/axios";
import CommandPalette from "../ui/CommandPalette";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import Drawer from "../ui/Drawer";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { compareItems } = useCompare();
  const { userInfo } = useSelector((state) => state.auth);

  const [keyword, setKeyword] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Live count badges
  const [wishlistCount, setWishlistCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);

  const searchInputRef = useRef(null);
  const menuRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pl-recent-searches") || "[]");
      if (Array.isArray(saved)) setRecentSearches(saved);
    } catch {
      // ignore
    }
  }, []);

  // Fetch live counts for logged-in user
  useEffect(() => {
    if (!userInfo) {
      setWishlistCount(0);
      setAlertsCount(0);
      return;
    }

    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const [wRes, aRes] = await Promise.allSettled([
          api.get("/wishlist"),
          api.get("/alerts/my-alerts"),
        ]);
        if (!isMounted) return;
        if (wRes.status === "fulfilled" && Array.isArray(wRes.value?.data)) {
          setWishlistCount(wRes.value.data.length);
        }
        if (aRes.status === "fulfilled" && Array.isArray(aRes.value?.data)) {
          setAlertsCount(aRes.value.data.length);
        }
      } catch {
        // silent fail on count
      }
    };

    fetchCounts();
    return () => {
      isMounted = false;
    };
  }, [userInfo, location.pathname]);

  // Global keyboard shortcuts (Cmd/Ctrl+K, /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      const isInput =
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("pl-recent-searches", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      saveRecentSearch(keyword);
      setIsSearchFocused(false);
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleSelectRecent = (term) => {
    setKeyword(term);
    setIsSearchFocused(false);
    navigate(`/search?keyword=${encodeURIComponent(term)}`);
  };

  const logoutHandler = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-bg/85 border-b border-line transition-colors">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-text hover:opacity-90 transition-opacity select-none group"
            >
              {/* Precision Lens glyph */}
              <div className="w-8 h-8 rounded-full border border-line bg-surface-2 flex items-center justify-center relative shadow-xs group-hover:border-signal/50 transition-colors">
                <div className="w-3.5 h-3.5 rounded-full border border-signal bg-signal/20 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-signal" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tighter text-text leading-none">
                  Price<span className="text-signal">Lens</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-muted uppercase -mt-0.5">
                  MARKET INTEL
                </span>
              </div>
            </Link>
          </div>

          {/* Centre: Expandable Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <form
              onSubmit={submitHandler}
              className={`w-full relative flex items-center transition-all duration-200 ${
                isSearchFocused
                  ? "ring-1 ring-signal/70 bg-surface shadow-spotlight"
                  : "bg-surface-2/60 hover:bg-surface-2 border border-line"
              } rounded-md`}
            >
              <Search className="w-4 h-4 text-muted shrink-0 ml-3.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  // slight delay to allow clicking recent search items
                  setTimeout(() => setIsSearchFocused(false), 200);
                }}
                placeholder="Search products, brands, models..."
                className="w-full bg-transparent px-3 py-2 text-sm text-text placeholder:text-muted/60 outline-none"
              />
              <div className="flex items-center gap-1.5 mr-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  title="Command Palette (Ctrl/Cmd+K)"
                  className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-muted bg-surface border border-line rounded cursor-pointer hover:text-text"
                >
                  <CmdIcon className="w-3 h-3" />
                  <span>K</span>
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 text-xs font-semibold bg-signal text-black rounded hover:brightness-105 transition cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Recent Searches Dropdown */}
            {isSearchFocused && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-line rounded-md p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3 h-3" /> Recent Searches
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setRecentSearches([]);
                      localStorage.removeItem("pl-recent-searches");
                    }}
                    className="hover:text-text text-[10px] cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                <div className="mt-1 space-y-0.5">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectRecent(term);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded text-xs text-text hover:bg-surface-2 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="truncate">{term}</span>
                      <span className="text-[10px] font-mono text-muted">Jump →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <IconButton
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-warn" />
              ) : (
                <Moon className="w-4 h-4 text-muted" />
              )}
            </IconButton>

            {/* Compare shortcut indicator */}
            <Link
              to="/compare"
              className="relative p-2 text-muted hover:text-text rounded-md hover:bg-surface-2 transition-colors"
              title="Product comparison"
            >
              <Scale className="w-4 h-4" />
              {compareItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-signal text-black font-mono font-bold text-[10px] flex items-center justify-center tabular-nums">
                  {compareItems.length}
                </span>
              )}
            </Link>

            {/* Logged in icons with LIVE count badges */}
            {userInfo ? (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 text-muted hover:text-text rounded-md hover:bg-surface-2 transition-colors"
                  title="My Wishlist"
                >
                  <Heart className="w-4 h-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-signal text-black font-mono font-bold text-[10px] flex items-center justify-center tabular-nums">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/alerts"
                  className="relative p-2 text-muted hover:text-text rounded-md hover:bg-surface-2 transition-colors"
                  title="Price Alerts"
                >
                  <Bell className="w-4 h-4" />
                  {alertsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-warn text-black font-mono font-bold text-[10px] flex items-center justify-center tabular-nums">
                      {alertsCount}
                    </span>
                  )}
                </Link>

                {/* User Avatar Menu Dropdown */}
                <div className="relative ml-1" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-1 rounded-full border border-line hover:border-text/30 transition cursor-pointer select-none"
                    aria-expanded={userMenuOpen}
                    aria-label="User menu"
                  >
                    {userInfo?.avatar ? (
                      <img
                        src={userInfo.avatar}
                        alt={userInfo.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-surface-2 border border-line text-text flex items-center justify-center font-bold text-xs uppercase font-mono">
                        {userInfo?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface border border-line rounded-lg p-2 shadow-2xl z-50 text-sm">
                      <div className="px-3 py-2 border-b border-line mb-1">
                        <p className="font-bold text-text truncate">{userInfo.name}</p>
                        <p className="text-xs text-muted truncate">{userInfo.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-mono uppercase px-1.5 py-0.5 bg-surface-2 border border-line rounded text-signal font-semibold">
                          {userInfo.role}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-surface-2 text-text transition-colors"
                        >
                          <User className="w-4 h-4 text-muted" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-surface-2 text-text transition-colors"
                        >
                          <Heart className="w-4 h-4 text-muted" />
                          <span>Wishlist ({wishlistCount})</span>
                        </Link>

                        <Link
                          to="/alerts"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-surface-2 text-text transition-colors"
                        >
                          <Bell className="w-4 h-4 text-muted" />
                          <span>Price Alerts ({alertsCount})</span>
                        </Link>

                        {/* Role-based dashboard links */}
                        {(userInfo.role === "local_seller" || userInfo.role === "admin") && (
                          <Link
                            to="/seller/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-surface-2 text-text transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-signal" />
                            <span>Seller Dashboard</span>
                          </Link>
                        )}

                        {userInfo.role === "admin" && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-surface-2 text-text transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-rise" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <div className="border-t border-line my-1 pt-1">
                          <button
                            type="button"
                            onClick={logoutHandler}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-rise hover:bg-rise/10 transition-colors cursor-pointer text-left font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Log out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="signal" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <IconButton
              variant="ghost"
              size="sm"
              className="md:hidden ml-1"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-text" />
            </IconButton>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Sheet Menu */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="PriceLens Navigation"
        side="right"
      >
        <div className="space-y-4">
          {/* Mobile search bar */}
          <form onSubmit={submitHandler} className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-surface-2 border border-line rounded-md pl-9 pr-3 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none"
            />
          </form>

          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-2 text-text font-medium"
            >
              Catalog
            </Link>
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-surface-2 text-text font-medium"
            >
              <span>Compare</span>
              {compareItems.length > 0 && (
                <span className="font-mono text-xs text-signal font-bold">
                  {compareItems.length} selected
                </span>
              )}
            </Link>

            {userInfo ? (
              <>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-surface-2 text-text font-medium"
                >
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="font-mono text-xs text-signal">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/alerts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-surface-2 text-text font-medium"
                >
                  <span>Price Alerts</span>
                  {alertsCount > 0 && (
                    <span className="font-mono text-xs text-warn">
                      {alertsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-2 text-text font-medium"
                >
                  Profile
                </Link>

                {(userInfo.role === "local_seller" || userInfo.role === "admin") && (
                  <Link
                    to="/seller/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-2 text-signal font-semibold"
                  >
                    Seller Dashboard
                  </Link>
                )}

                {userInfo.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-2 text-rise font-semibold"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <div className="pt-4 border-t border-line">
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full"
                    onClick={logoutHandler}
                  >
                    Log out
                  </Button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-line">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="signal" size="sm" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </Drawer>

      {/* Mobile Bottom Tab Bar (Home · Search · Compare · Alerts · Profile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-lg border-t border-line px-2 py-1.5 flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] ${
            location.pathname === "/" ? "text-signal font-semibold" : "text-muted"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Explore</span>
        </Link>

        <Link
          to="/compare"
          className={`relative flex flex-col items-center gap-0.5 p-1 text-[10px] ${
            location.pathname.startsWith("/compare")
              ? "text-signal font-semibold"
              : "text-muted"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Compare</span>
          {compareItems.length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-signal" />
          )}
        </Link>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 text-[10px] text-muted cursor-pointer"
        >
          <CmdIcon className="w-4 h-4" />
          <span>Command</span>
        </button>

        <Link
          to={userInfo ? "/alerts" : "/login"}
          className={`relative flex flex-col items-center gap-0.5 p-1 text-[10px] ${
            location.pathname === "/alerts"
              ? "text-signal font-semibold"
              : "text-muted"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
          {alertsCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-warn" />
          )}
        </Link>

        <Link
          to={userInfo ? "/profile" : "/login"}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] ${
            location.pathname === "/profile" || location.pathname === "/login"
              ? "text-signal font-semibold"
              : "text-muted"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account</span>
        </Link>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  );
};

export default Navbar;