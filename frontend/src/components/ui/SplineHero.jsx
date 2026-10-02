import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "motion/react";
import { TrendingDown, ShieldCheck, Eye } from "lucide-react";

const Spline = lazy(() => import("@splinetool/react-spline"));

const LensFallback = ({ variant: _variant = "default" }) => {
  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto flex items-center justify-center select-none pointer-events-none">
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-signal/10 blur-3xl opacity-50" />

      {/* Rotating outer aperture ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full border border-dashed border-line/60 flex items-center justify-center"
      >
        <div className="absolute -top-1.5 w-3 h-3 rounded-full bg-signal shadow-glow" />
        <div className="absolute -bottom-1.5 w-2 h-2 rounded-full bg-text/40" />
      </motion.div>

      {/* Middle glass lens border with tick marks */}
      <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-line bg-surface/80 backdrop-blur-md flex items-center justify-center shadow-2xl">
        {/* Tick marks around bezel */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <div
            key={deg}
            className="absolute w-1.5 h-0.5 bg-line"
            style={{
              transform: `rotate(${deg}deg) translate(130px, 0)`,
            }}
          />
        ))}

        {/* Inner lens iris */}
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-signal/40 bg-radial from-signal/15 via-surface-2 to-surface flex flex-col items-center justify-center p-4 text-center overflow-hidden">
          <Eye className="w-8 h-8 text-signal mb-1" />
          <span className="font-mono text-xs font-bold text-text uppercase tracking-widest">
            PRICELENS
          </span>
          <span className="font-mono text-[10px] text-signal tabular-nums mt-0.5">
            REALTIME INTEL
          </span>

          {/* Crosshair lines */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-line/40 -translate-y-1/2" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-line/40 -translate-x-1/2" />
        </div>
      </div>

      {/* Floating price indicator badge #1 */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-3 right-4 sm:right-6 bg-surface border border-line rounded-lg px-3 py-2 shadow-xl flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-full bg-drop/20 text-drop flex items-center justify-center">
          <TrendingDown className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-mono text-muted tracking-tight">Best Deal</p>
          <p className="text-xs font-mono font-bold text-signal tabular-nums">
            ₹49,999 <span className="text-[10px] text-drop">(-18%)</span>
          </p>
        </div>
      </motion.div>

      {/* Floating price indicator badge #2 */}
      <motion.div
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-2 left-2 sm:left-4 bg-surface border border-line rounded-lg px-3 py-2 shadow-xl flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-full bg-surface-2 border border-line text-signal flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-mono text-muted tracking-tight">Verified Sellers</p>
          <p className="text-xs font-mono font-semibold text-text">Online & Local</p>
        </div>
      </motion.div>
    </div>
  );
};

const SplineHero = ({ className, variant = "default" }) => {
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
  const [hasError, setHasError] = useState(false);
  const splineUrl = import.meta.env.VITE_SPLINE_SCENE_URL;

  useEffect(() => {
    // Only attempt 3D spline if URL is provided, screen is desktop (>= 768px), and reduced motion is off
    if (
      splineUrl &&
      typeof window !== "undefined" &&
      window.innerWidth >= 768 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShouldLoadSpline(true);
    }
  }, [splineUrl]);

  if (!shouldLoadSpline || hasError || !splineUrl) {
    return <LensFallback variant={variant} />;
  }

  return (
    <div className={className}>
      <Suspense fallback={<LensFallback variant={variant} />}>
        <Spline
          scene={splineUrl}
          onError={() => setHasError(true)}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
};

export default SplineHero;
