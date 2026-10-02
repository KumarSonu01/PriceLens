import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  Store,
  ExternalLink,
  Shield,
  Heart,
  Bell,
  LayoutDashboard,
} from "lucide-react";
import api from "../api/axios";
import { setCredentials } from "../features/auth/authSlice";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Tabs from "../components/ui/Tabs";
import Badge from "../components/ui/Badge";
import Stat from "../components/ui/Stat";

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("account");
  const [storeLink, setStoreLink] = useState("");
  const [savingStoreLink, setSavingStoreLink] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Summary counts
  const [wishlistCount, setWishlistCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);

  // Load seller profile & stats
  useEffect(() => {
    let isMounted = true;
    const loadProfileData = async () => {
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
        // ignore
      }

      if (userInfo?.role === "local_seller") {
        try {
          const { data } = await api.get("/sellers/profile");
          if (isMounted) setStoreLink(data?.storeLink || "");
        } catch (error) {
          console.log("Seller profile error:", error);
        }
      }
    };

    loadProfileData();
    return () => {
      isMounted = false;
    };
  }, [userInfo]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setAvatarUploading(true);
      const { data } = await api.post("/upload/avatar", formData);

      await api.put("/auth/profile", {
        avatar: data.imageUrl,
      });

      // Update Redux state and localStorage without needing a full window reload
      const updatedUser = { ...userInfo, avatar: data.imageUrl };
      dispatch(setCredentials(updatedUser));
      toast.success("Profile photo updated");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setAvatarUploading(true);
      await api.delete("/upload/avatar");
      await api.put("/auth/profile", { avatar: "" });

      const updatedUser = { ...userInfo, avatar: "" };
      dispatch(setCredentials(updatedUser));
      toast.success("Profile photo removed");
    } catch {
      toast.error("Failed to remove photo");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveStoreLink = async () => {
    try {
      setSavingStoreLink(true);

      let normalizedLink = storeLink.trim();
      if (normalizedLink && !/^https?:\/\//i.test(normalizedLink)) {
        normalizedLink = `https://${normalizedLink}`;
      }

      const { data } = await api.put("/sellers/profile", {
        storeLink: normalizedLink,
      });

      setStoreLink(data?.storeLink || "");
      toast.success("Store link updated successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update store link"
      );
    } finally {
      setSavingStoreLink(false);
    }
  };

  const tabs = [
    { id: "account", label: "Account Overview", icon: User },
    ...(userInfo?.role === "local_seller"
      ? [{ id: "store", label: "Storefront Presence", icon: Store }]
      : []),
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 space-y-8 min-h-[80vh]">
      {/* Header Card with Avatar & Metadata */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Avatar Area */}
          <div className="relative group shrink-0 text-center">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-line bg-surface-2 overflow-hidden flex items-center justify-center shadow-lg relative">
              {userInfo?.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-mono text-3xl font-bold text-text uppercase">
                  {userInfo?.name?.charAt(0) || "U"}
                </span>
              )}

              {avatarUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-signal font-mono text-[10px]">
                  Uploading...
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="text-xs font-semibold text-signal hover:underline cursor-pointer"
              >
                Change
              </button>
              {userInfo?.avatar && (
                <>
                  <span className="text-line">·</span>
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={avatarUploading}
                    className="text-xs text-rise hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                {userInfo?.name}
              </h1>
              <Badge
                variant={
                  userInfo?.role === "admin"
                    ? "rise"
                    : userInfo?.role === "local_seller"
                    ? "signal"
                    : "neutral"
                }
                size="sm"
              >
                {userInfo?.role?.toUpperCase()}
              </Badge>
            </div>

            <p className="text-sm font-mono text-muted">{userInfo?.email}</p>

            {userInfo?.shopName && (
              <p className="text-xs text-text flex items-center gap-1.5 justify-center sm:justify-start pt-1">
                <Store className="w-3.5 h-3.5 text-signal" />
                <span className="font-bold">{userInfo.shopName}</span>
                {userInfo.city && <span className="text-muted">({userInfo.city})</span>}
              </p>
            )}

            {/* Quick Links Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-3 justify-center sm:justify-start">
              <Link to="/wishlist">
                <Button variant="secondary" size="sm" icon={Heart}>
                  Wishlist ({wishlistCount})
                </Button>
              </Link>
              <Link to="/alerts">
                <Button variant="secondary" size="sm" icon={Bell}>
                  Alerts ({alertsCount})
                </Button>
              </Link>

              {(userInfo?.role === "local_seller" || userInfo?.role === "admin") && (
                <Link to="/seller/dashboard">
                  <Button variant="outline" size="sm" icon={LayoutDashboard}>
                    Seller Hub
                  </Button>
                </Link>
              )}

              {userInfo?.role === "admin" && (
                <Link to="/admin/dashboard">
                  <Button variant="signal" size="sm" icon={Shield}>
                    Admin Terminal
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Account Overview */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Stat
              label="Saved in Wishlist"
              value={wishlistCount}
              description="Tracked products"
            />
            <Stat
              label="Active Price Monitors"
              value={alertsCount}
              description="Live threshold triggers"
            />
            <Stat
              label="Platform Persona"
              value={userInfo?.role === "buyer" ? "Active Buyer" : "Registered Merchant"}
              description="Verified status"
            />
          </div>

          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-text tracking-tight border-b border-line pb-3">
              Account Metadata & Security
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1 p-3 rounded-md bg-surface-2/40 border border-line">
                <span className="text-muted block">Identity Coordinate</span>
                <span className="text-text font-bold">{userInfo?.email}</span>
              </div>
              <div className="space-y-1 p-3 rounded-md bg-surface-2/40 border border-line">
                <span className="text-muted block">Primary Role Tier</span>
                <span className="text-signal font-bold uppercase">{userInfo?.role}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Storefront Presence (Sellers only) */}
      {activeTab === "store" && userInfo?.role === "local_seller" && (
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-text tracking-tight">
              Merchant Storefront URL
            </h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Connect your online store, WhatsApp catalog, Instagram shop, or Google Maps listing. Outbound buyer clicks from your listings will route directly here.
            </p>
          </div>

          <div className="space-y-3 max-w-xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="url"
                value={storeLink}
                onChange={(e) => setStoreLink(e.target.value)}
                placeholder="https://yourstore.com or https://wa.me/..."
                className="flex-1"
              />
              <Button
                variant="signal"
                size="md"
                onClick={handleSaveStoreLink}
                loading={savingStoreLink}
              >
                Save Link
              </Button>
            </div>

            {storeLink && (
              <a
                href={storeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-signal hover:underline font-mono"
              >
                <span>Verify Destination URL ({storeLink})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;