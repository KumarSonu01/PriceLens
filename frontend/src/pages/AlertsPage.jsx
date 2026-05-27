import {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AlertsPage = () => {
  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchAlerts =
    async () => {
      try {
        const { data } =
          await api.get(
            "/price-alerts"
          );

        setAlerts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Loading Alerts...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold">
          My Price Alerts
        </h1>

        <div className="bg-black text-white px-5 py-2 rounded-xl font-semibold">
          {alerts.length} Alerts
        </div>
      </div>

      {alerts.length ===
      0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Alerts Yet
          </h2>

          <p className="text-gray-500 mt-3">
            Create alerts on
            products to track
            future price drops.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {alerts.map(
            (alert) => (
              <div
                key={alert._id}
                className={`bg-white rounded-2xl shadow p-6 border ${
                  alert.isTriggered
                    ? "border-green-500"
                    : "border-gray-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <img
                      src={
                        alert.product
                          ?.images?.[0] ||
                        "https://via.placeholder.com/100"
                      }
                      alt={
                        alert.product
                          ?.title
                      }
                      className="w-24 h-24 object-contain bg-gray-100 rounded-xl p-2"
                    />

                    <div>
                      <h2 className="text-2xl font-bold">
                        {
                          alert
                            .product
                            ?.title
                        }
                      </h2>

                      <p className="text-gray-500 mt-2">
                        Target Price:
                        ₹
                        {alert.targetPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    {alert.isTriggered ? (
                      <div className="bg-green-100 text-green-700 px-5 py-3 rounded-xl font-bold">
                        🎉 Price Dropped
                      </div>
                    ) : (
                      <div className="bg-yellow-100 text-yellow-700 px-5 py-3 rounded-xl font-bold">
                        Waiting For Drop
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;