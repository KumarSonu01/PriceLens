import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-black text-white text-center py-5">
        <p>
          © 2026 PriceLens. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;