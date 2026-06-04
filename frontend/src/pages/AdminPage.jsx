import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

const AdminPage = () => {
  const navigate =
    useNavigate();

  const [stats, setStats] =
    useState({
      totalProducts: 0,
      totalListings: 0,
      totalUsers: 0,
      totalSellers: 0,
      importedProducts: 0,
      totalAlerts: 0,
      activeAlerts: 0,
      triggeredAlerts: 0,
    });

  useEffect(() => {
    const fetchStats =
      async () => {
        try {
          const { data } =
            await api.get(
              "/admin/stats"
            );

          setStats(data);
        } catch (error) {
          console.log(error);
        }
      };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-10 min-h-[80vh]">
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mt-3 text-lg">
          Manage products,
          listings, sellers,
          users, alerts and
          imports.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Products
          </h2>

          <p className="text-4xl font-bold mt-3">
            {
              stats.totalProducts
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Listings
          </h2>

          <p className="text-4xl font-bold mt-3">
            {
              stats.totalListings
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Sellers
          </h2>

          <p className="text-4xl font-bold mt-3">
            {
              stats.totalSellers
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Users
          </h2>

          <p className="text-4xl font-bold mt-3">
            {
              stats.totalUsers
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-600">
            Imported Products
          </h2>

          <p className="text-4xl font-bold mt-3 text-green-600">
            {
              stats.importedProducts
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Alerts
          </h2>

          <p className="text-4xl font-bold mt-3 text-blue-600">
            {
              stats.totalAlerts
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-600">
            Active Alerts
          </h2>

          <p className="text-4xl font-bold mt-3 text-orange-600">
            {
              stats.activeAlerts
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-600">
            Triggered Alerts
          </h2>

          <p className="text-4xl font-bold mt-3 text-green-600">
            {
              stats.triggeredAlerts
            }
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <button
          onClick={() =>
            navigate(
              "/admin/add-product"
            )
          }
          className="bg-black text-white p-8 rounded-xl hover:opacity-90 transition"
        >
          Add Product
        </button>

        <button
          onClick={() =>
            navigate(
              "/admin/import-product"
            )
          }
          className="bg-green-600 text-white p-8 rounded-xl hover:opacity-90 transition"
        >
          Import Product
        </button>

        <button
          onClick={() =>
            navigate(
              "/admin/manage-products"
            )
          }
          className="bg-purple-600 text-white p-8 rounded-xl hover:opacity-90 transition"
        >
          Manage Products
        </button>

        <button
          onClick={() =>
            navigate(
              "/admin/listings"
            )
          }
          className="bg-blue-600 text-white p-8 rounded-xl hover:opacity-90 transition"
        >
          View All Listings
        </button>
      </div>
    </div>
  );
};

export default AdminPage;