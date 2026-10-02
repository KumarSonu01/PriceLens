import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaEnvelope,
} from "react-icons/fa";

const platforms = [
  "Amazon India",
  "Flipkart",
  "Zepto Quick Commerce",
  "Blinkit",
  "Local Electronics Shops",
  "Verified Regional Retailers",
];

const Footer = () => {
  return (
    <footer className="w-full bg-surface border-t border-line text-text transition-colors">
      {/* Platform Marquee Strip */}
      <div className="border-b border-line py-3 overflow-hidden bg-surface-2/40 select-none">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {[...platforms, ...platforms, ...platforms].map((plat, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              {plat}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Editorial Value Prop */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border border-line bg-surface-2 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full border border-signal bg-signal/20 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-signal" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-text">
                Price<span className="text-signal">Lens</span>
              </span>
            </Link>

            <p className="text-muted text-sm leading-relaxed max-w-sm">
              Cross-market intelligence terminal comparing Amazon, Flipkart, Zepto, and neighborhood local sellers in real time. Numbers, trends, and true price transparency.
            </p>

            {/* Social & Contact */}
            <div className="flex items-center gap-3 pt-2 text-muted">
              <a
                href="https://www.facebook.com/hiitsonu/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md border border-line bg-surface-2 flex items-center justify-center hover:text-text hover:border-text/30 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.instagram.com/hiitsonu/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md border border-line bg-surface-2 flex items-center justify-center hover:text-text hover:border-text/30 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://x.com/hiitsonu"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md border border-line bg-surface-2 flex items-center justify-center hover:text-text hover:border-text/30 transition-colors"
                aria-label="Twitter / X"
              >
                <FaTwitter className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.linkedin.com/in/sonukumar01/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-md border border-line bg-surface-2 flex items-center justify-center hover:text-text hover:border-text/30 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-3.5 h-3.5" />
              </a>

              <a
                href="mailto:sonukumarcs39@gmail.com?subject=PriceLens%20Merchant%20Opt-Out%20Request"
                className="w-8 h-8 rounded-md border border-line bg-surface-2 flex items-center justify-center hover:text-rise hover:border-rise/30 transition-colors"
                aria-label="Merchant Opt-Out Email"
                title="Merchant Opt-Out"
              >
                <FaEnvelope className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4 font-mono">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/?category=Mobile"
                  className="text-text hover:text-signal transition-colors"
                >
                  Mobiles
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Laptop"
                  className="text-text hover:text-signal transition-colors"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Headphones"
                  className="text-text hover:text-signal transition-colors"
                >
                  Headphones
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Television"
                  className="text-text hover:text-signal transition-colors"
                >
                  Televisions
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-text hover:text-signal transition-colors"
                >
                  Marketplace Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4 font-mono">
              Account
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/wishlist"
                  className="text-text hover:text-signal transition-colors"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/alerts"
                  className="text-text hover:text-signal transition-colors"
                >
                  Price Alerts
                </Link>
              </li>
              <li>
                <Link
                  to="/compare"
                  className="text-text hover:text-signal transition-colors"
                >
                  Product Comparison
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-text hover:text-signal transition-colors"
                >
                  Profile & Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-text hover:text-signal transition-colors"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Sellers & Admin */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4 font-mono">
              Merchant Hub
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/register"
                  className="text-text hover:text-signal transition-colors"
                >
                  Become a Local Seller
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/dashboard"
                  className="text-text hover:text-signal transition-colors"
                >
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/add-listing"
                  className="text-text hover:text-signal transition-colors"
                >
                  Add Store Listing
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/manage-listings"
                  className="text-text hover:text-signal transition-colors"
                >
                  Manage Inventory
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Small Print Bottom */}
        <div className="border-t border-line mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© 2026 PriceLens. All market data rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-text transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-text transition-colors">
              Terms of Service
            </Link>
            <a
              href="mailto:sonukumarcs39@gmail.com?subject=PriceLens%20Merchant%20Opt-Out%20Request"
              className="hover:text-text transition-colors"
            >
              Merchant Opt-Out
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;