import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import CompareBar from "./components/compare/CompareBar";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import SellerRoute from "./components/auth/SellerRoute";

// Lazy-loaded pages for optimal performance and chunking
const Home = lazy(() => import("./pages/Home"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

const SellerPage = lazy(() => import("./pages/SellerPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

const AddProductPage = lazy(() => import("./pages/AddProductPage"));
const AddListingPage = lazy(() => import("./pages/AddListingPage"));

const ManageListingsPage = lazy(() => import("./pages/ManageListingsPage"));
const ManageProductsPage = lazy(() => import("./pages/ManageProductsPage"));

const AdminListingsPage = lazy(() => import("./pages/AdminListingsPage"));

const EditProductPage = lazy(() => import("./pages/EditProductPage"));

const SearchPage = lazy(() => import("./pages/SearchPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));

const ImportProductPage = lazy(() => import("./pages/ImportProductPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 rounded-full border-2 border-line border-t-signal animate-spin" />
    <span className="font-mono text-xs text-muted tracking-wider uppercase">
      Loading Intel...
    </span>
  </div>
);

function App() {
  return (
    <>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Route>

            <Route element={<SellerRoute />}>
              <Route path="/seller/dashboard" element={<SellerPage />} />
              <Route path="/seller/add-listing" element={<AddListingPage />} />
              <Route
                path="/seller/manage-listings"
                element={<ManageListingsPage />}
              />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminPage />} />
              <Route path="/admin/add-product" element={<AddProductPage />} />
              <Route
                path="/admin/import-product"
                element={<ImportProductPage />}
              />
              <Route
                path="/admin/manage-products"
                element={<ManageProductsPage />}
              />
              <Route
                path="/admin/edit-product/:id"
                element={<EditProductPage />}
              />
              <Route path="/admin/listings" element={<AdminListingsPage />} />
            </Route>

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>

      <CompareBar />
    </>
  );
}

export default App;