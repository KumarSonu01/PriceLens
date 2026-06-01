import {
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/layout/Layout";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import SellerRoute from "./components/auth/SellerRoute";

import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

import SellerPage from "./pages/SellerPage";
import AdminPage from "./pages/AdminPage";

import AddProductPage from "./pages/AddProductPage";
import AddListingPage from "./pages/AddListingPage";

import ManageListingsPage from "./pages/ManageListingsPage";
import ManageProductsPage from "./pages/ManageProductsPage";

import AdminListingsPage from "./pages/AdminListingsPage";

import EditProductPage from "./pages/EditProductPage";

import SearchPage from "./pages/SearchPage";
import AlertsPage from "./pages/AlertsPage";
import WishlistPage from "./pages/WishlistPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/product/:id"
          element={<ProductPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/search"
          element={<SearchPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/alerts"
            element={<AlertsPage />}
          />

          <Route
            path="/wishlist"
            element={<WishlistPage />}
          />
        </Route>

        <Route element={<SellerRoute />}>
          <Route
            path="/seller/dashboard"
            element={<SellerPage />}
          />

          <Route
            path="/seller/add-listing"
            element={<AddListingPage />}
          />

          <Route
            path="/seller/manage-listings"
            element={<ManageListingsPage />}
          />
        </Route>

        <Route element={<AdminRoute />}>
          <Route
            path="/admin/dashboard"
            element={<AdminPage />}
          />

          <Route
            path="/admin/add-product"
            element={<AddProductPage />}
          />

          <Route
            path="/admin/manage-products"
            element={<ManageProductsPage />}
          />

          <Route
            path="/admin/edit-product/:id"
            element={<EditProductPage />}
          />

          <Route
            path="/admin/listings"
            element={<AdminListingsPage />}
          />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;