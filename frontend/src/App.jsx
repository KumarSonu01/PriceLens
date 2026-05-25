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
          element={<ProtectedRoute />}
        >
          <Route
            path="/profile"
            element={<ProfilePage />}
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