import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../api/axios";

import { toast } from "react-toastify";

const AlertsPage = () => {
  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts =
    async () => {
      try {
        const { data } =
          await api.get(
            "/alerts/my-alerts"
          );

        setAlerts(data);
      } catch (error) {
        toast.error(
          "Failed to load alerts"
        );
      } finally {
        setLoading(false);
      }
    };

  const deleteAlert =
    async (id) => {
      try {
        await api.delete(
          `/alerts/${id}`
        );

        setAlerts((prev) =>
          prev.filter(
            (alert) =>
              alert._id !== id
          )
        );

        toast.success(
          "Alert deleted"
        );
      } catch (error) {
        toast.error(
          "Delete failed"
        );
      }
    };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-lg font-medium">
        Loading alerts...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        My Price Alerts
      </h1>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Alerts Yet
          </h2>

          <p className="text-gray-600">
            Create a price alert
            from any product page.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {alerts.map(
            (alert) => (
              <div
                key={
                  alert._id
                }
                className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={
                      alert
                        .product
                        ?.images?.[0] ||
                      "https://via.placeholder.com/100"
                    }
                    alt={
                      alert
                        .product
                        ?.title
                    }
                    className="w-24 h-24 object-cover rounded-lg border"
                  />

                  <div>
                    <Link
                      to={`/product/${alert.product?._id}`}
                      className="font-semibold text-lg hover:text-green-600 transition"
                    >
                      {
                        alert
                          .product
                          ?.title
                      }
                    </Link>

                    <p className="text-gray-600 mt-1">
                      Target Price:
                      <span className="font-semibold text-green-600 ml-1">
                        ₹
                        {alert.targetPrice.toLocaleString()}
                      </span>
                    </p>

                    <div className="mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          alert.isTriggered
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {alert.isTriggered
                          ? "Triggered"
                          : "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    deleteAlert(
                      alert._id
                    )
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete Alert
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;