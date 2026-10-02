import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { setCredentials } from "../features/auth/authSlice";
import SplineHero from "../components/ui/SplineHero";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FormField from "../components/ui/FormField";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "local_seller") {
        navigate("/seller/dashboard");
      } else if (userInfo.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      dispatch(setCredentials(data));
      toast.success("Welcome back to PriceLens");

      if (data.role === "local_seller") {
        navigate("/seller/dashboard");
      } else if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials provided");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] grid lg:grid-cols-12 items-stretch">
      {/* Left Form Panel */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-2 border border-line text-[11px] font-mono text-signal uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              AUTHENTICATION GATE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
              Sign In to Your Terminal
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-2">
              Access saved SKU monitors, personalized alert feeds, and merchant tools.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <FormField label="Email Coordinate" required>
              <Input
                type="email"
                icon={Mail}
                placeholder="developer@pricelens.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </FormField>

            <FormField label="Security Key / Password" required>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text cursor-pointer p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>

            <Button
              type="submit"
              variant="signal"
              size="lg"
              loading={loading}
              className="w-full"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
            <span className="text-muted">Unregistered user?</span>
            <Link
              to="/register"
              className="font-bold text-signal hover:underline"
            >
              Create Account →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Brand Panel (Spline / Fallback) */}
      <div className="hidden lg:flex lg:col-span-6 bg-surface-2/40 border-l border-line p-12 flex-col justify-between relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-mono text-muted uppercase tracking-widest">
            PRICELENS SURVEILLANCE
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Zero speculation. True landed costs.
          </h2>
        </div>

        <div className="my-auto py-12">
          <SplineHero />
        </div>

        <div className="text-xs font-mono text-muted relative z-10 border-t border-line/60 pt-4 flex justify-between">
          <span>SECURE END-TO-END TLS</span>
          <span>EST. 2026</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;