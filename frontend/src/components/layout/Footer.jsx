import {
  Link,
} from "react-router-dom";

import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-extrabold">
              PriceLens
            </h2>

            <p className="text-gray-400 mt-5 leading-relaxed">
              Compare smarter,
              discover better
              deals, and track
              real-time prices
              across online and
              local sellers with
              PriceLens.
            </p>

            <div className="flex items-center gap-4 mt-6 text-2xl">
             <a
                href="https://www.facebook.com/hiitsonu/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 transition"
              >
                <FaFacebook />
              </a>

              <a
                href="https://www.instagram.com/hiitsonu/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-400 transition"
              >
                <FaInstagram />
              </a>

              <a
                href="https://x.com/hiitsonu"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 transition"
              >
                <FaTwitter />
              </a>

              <a
                href="https://www.linkedin.com/in/sonukumar01/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-500 transition"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">
              Shop
            </h3>

            <div className="space-y-3 text-gray-400">
              <Link
                to="/?category=Mobiles"
                className="block hover:text-white transition"
              >
                Mobiles
              </Link>

              <Link
                to="/?category=Laptops"
                className="block hover:text-white transition"
              >
                Laptops
              </Link>

              <Link
                to="/?category=Headphones"
                className="block hover:text-white transition"
              >
                Headphones
              </Link>

              <Link
                to="/"
                className="block hover:text-white transition"
              >
                Deals
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">
              Account
            </h3>

            <div className="space-y-3 text-gray-400">
              <Link
                to="/wishlist"
                className="block hover:text-white transition"
              >
                Wishlist
              </Link>

              <Link
                to="/alerts"
                className="block hover:text-white transition"
              >
                Alerts
              </Link>

              <Link
                to="/profile"
                className="block hover:text-white transition"
              >
                Profile
              </Link>

              <Link
                to="/login"
                className="block hover:text-white transition"
              >
                Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">
              Sellers
            </h3>

            <div className="space-y-3 text-gray-400">
              <Link
                to="/register"
                className="block hover:text-white transition"
              >
                Become Seller
              </Link>

              <Link
                to="/seller/dashboard"
                className="block hover:text-white transition"
              >
                Dashboard
              </Link>

              <Link
                to="/seller/add-product"
                className="block hover:text-white transition"
              >
                Add Product
              </Link>

              <Link
                to="/seller/add-listing"
                className="block hover:text-white transition"
              >
                Add Listing
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="text-gray-500 text-sm">
            © 2026 PriceLens.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a
              href="#"
              className="hover:text-white transition"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="hover:text-white transition"
            >
              Terms
            </a>

            <a
              href="#"
              className="hover:text-white transition"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;