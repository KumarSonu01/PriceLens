import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main>{children}</main>

      <footer className="bg-black text-white text-center py-5 mt-20">
        <p>
          © 2026 PriceLens. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;