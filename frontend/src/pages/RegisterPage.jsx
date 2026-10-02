import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Store,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { setCredentials } from "../features/auth/authSlice";
import SplineHero from "../components/ui/SplineHero";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FormField from "../components/ui/FormField";
import FileDrop from "../components/ui/FileDrop";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("buyer"); // 'buyer' | 'local_seller' | 'admin'

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Admin secret key
  const [adminSecretKey, setAdminSecretKey] = useState("");

  // Seller specific fields
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryRadius, setDeliveryRadius] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  // Password strength meter
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "Empty", color: "bg-line" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: "Weak", color: "bg-rise" };
    if (score <= 4) return { score: 2, label: "Moderate", color: "bg-warn" };
    return { score: 3, label: "Strong", color: "bg-drop" };
  }, [password]);

  const handleAvatarFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingImage(true);
      const { data } = await api.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAvatar(data.imageUrl);
      setAvatarPreview(data.imageUrl);
      toast.success("Avatar uploaded");
    } catch {
      toast.error("Avatar upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all required credentials");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name,
        email,
        password,
        role,
        avatar,
        adminSecretKey,
        shopName,
        shopAddress,
        city,
        phone,
        deliveryRadius,
      };

      const { data } = await api.post("/auth/register", payload);

      dispatch(setCredentials(data));
      toast.success("Account successfully created");

      if (data.role === "local_seller") {
        navigate("/seller/dashboard");
      } else if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] grid lg:grid-cols-12 items-stretch">
      {/* Left Form Column */}
      <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-xl space-y-8">
          <div>
            <span className="text-[11px] font-mono text-signal uppercase tracking-wider block mb-2">
              NEW REGISTRATION
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
              Create Your PriceLens Account
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-2">
              Select your market persona to unlock buyer tracking or merchant publishing.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            {/* Step 1: Role Selector 3 Cards */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-muted block">
                Select Account Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === "buyer"
                      ? "bg-signal text-black border-signal shadow-sm font-semibold"
                      : "bg-surface text-text border-line hover:border-text/30"
                  }`}
                >
                  <User className="w-5 h-5 mb-2" />
                  <div>
                    <p className="text-sm font-bold">Buyer</p>
                    <p className={`text-[10px] ${role === "buyer" ? "text-black/70" : "text-muted"}`}>
                      Track price drops & deals
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("local_seller")}
                  className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === "local_seller"
                      ? "bg-signal text-black border-signal shadow-sm font-semibold"
                      : "bg-surface text-text border-line hover:border-text/30"
                  }`}
                >
                  <Store className="w-5 h-5 mb-2" />
                  <div>
                    <p className="text-sm font-bold">Local Seller</p>
                    <p className={`text-[10px] ${role === "local_seller" ? "text-black/70" : "text-muted"}`}>
                      List local store stock
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === "admin"
                      ? "bg-rise text-white border-rise shadow-sm font-semibold"
                      : "bg-surface text-text border-line hover:border-text/30"
                  }`}
                >
                  <Shield className="w-5 h-5 mb-2" />
                  <div>
                    <p className="text-sm font-bold">Admin</p>
                    <p className={`text-[10px] ${role === "admin" ? "text-white/80" : "text-muted"}`}>
                      Catalog management
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Admin Secret Key Gate */}
            {role === "admin" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rise/10 border border-rise/30 rounded-lg space-y-2"
              >
                <FormField
                  label="Master Admin Secret Key"
                  hint="Required for elevated security access"
                  required
                >
                  <Input
                    type="password"
                    icon={Lock}
                    placeholder="Enter security key provided by system admin"
                    value={adminSecretKey}
                    onChange={(e) => setAdminSecretKey(e.target.value)}
                    required
                  />
                </FormField>
              </motion.div>
            )}

            {/* Step 2: Avatar Upload using FileDrop */}
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                Profile Avatar (Optional)
              </label>
              <div className="flex items-center gap-4">
                <FileDrop
                  preview={avatarPreview}
                  onFileSelect={handleAvatarFile}
                  onRemove={() => {
                    setAvatar("");
                    setAvatarPreview("");
                  }}
                  loading={uploadingImage}
                  circular
                  label="Select Photo"
                  hint="PNG or JPG"
                />
                <p className="text-xs text-muted max-w-xs">
                  Upload an optional identifier for your buyer profile or storefront logo.
                </p>
              </div>
            </div>

            {/* Step 3: Basics (Name, Email, Password) */}
            <div className="space-y-4">
              <FormField label="Full Name / Display Identity" required>
                <Input
                  type="text"
                  icon={User}
                  placeholder="Sonu Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Email Coordinate" required>
                <Input
                  type="email"
                  icon={Mail}
                  placeholder="sonu@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </FormField>

              <div className="space-y-1.5">
                <FormField label="Security Password" required>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      icon={Lock}
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormField>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-1 flex-1 rounded-full ${
                            passwordStrength.score >= lvl
                              ? passwordStrength.color
                              : "bg-surface-2 border border-line"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[11px] text-muted">
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Local Seller Extra Fields (Animated In) */}
            <AnimatePresence>
              {role === "local_seller" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4 border-t border-line"
                >
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-signal">
                    <Store className="w-4 h-4" />
                    <span>Storefront Profile Information</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Registered Shop Name" required>
                      <Input
                        type="text"
                        placeholder="Apex Electronics"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        required={role === "local_seller"}
                      />
                    </FormField>

                    <FormField label="Operating City" required>
                      <Input
                        type="text"
                        placeholder="Bengaluru"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required={role === "local_seller"}
                      />
                    </FormField>
                  </div>

                  <FormField label="Physical Store Address" required>
                    <Input
                      type="text"
                      placeholder="104 Brigade Road, Near Metro Gate 2"
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                      required={role === "local_seller"}
                    />
                  </FormField>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Direct Contact Phone" required>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required={role === "local_seller"}
                      />
                    </FormField>

                    <FormField label="Delivery Radius (km)" hint="Radius in km">
                      <Input
                        type="number"
                        placeholder="15"
                        value={deliveryRadius}
                        onChange={(e) => setDeliveryRadius(e.target.value)}
                      />
                    </FormField>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              variant="signal"
              size="lg"
              loading={loading || uploadingImage}
              disabled={uploadingImage}
              className="w-full"
            >
              <span>Initialize Account</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
            <span className="text-muted">Already registered?</span>
            <Link to="/login" className="font-bold text-signal hover:underline">
              Sign In Instead →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Brand Panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-surface-2/40 border-l border-line p-12 flex-col justify-between relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-mono text-signal uppercase tracking-widest">
            DECENTRALIZED COMMERCE
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Bridging local merchants with online marketplaces.
          </h2>
        </div>

        <div className="my-auto py-12">
          <SplineHero />
        </div>

        <div className="text-xs font-mono text-muted relative z-10 border-t border-line/60 pt-4 flex justify-between">
          <span>NO HIDDEN SURCHARGES</span>
          <span>EST. 2026</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;