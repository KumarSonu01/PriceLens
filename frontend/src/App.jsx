import {
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/layout/Layout";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home";

import ProductPage from "./pages/ProductPage";

import LoginPage from "./pages/LoginPage";

import ProfilePage from "./pages/ProfilePage";

import SellerPage from "./pages/SellerPage";

import AddProductPage from "./pages/AddProductPage";

import AddListingPage from "./pages/AddListingPage";

import ManageListingsPage from "./pages/ManageListingsPage";

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
          path="/search"
          element={<SearchPage />}
        />

        <Route
          element={<ProtectedRoute />}
        >
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

          <Route
            path="/seller/dashboard"
            element={<SellerPage />}
          />

          <Route
            path="/seller/add-product"
            element={
              <AddProductPage />
            }
          />

          <Route
            path="/seller/add-listing"
            element={
              <AddListingPage />
            }
          />

          <Route
            path="/seller/manage-listings"
            element={
              <ManageListingsPage />
            }
          />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;