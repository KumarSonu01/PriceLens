import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import api from "../api/axios";

const SellerPage = () => {
  const navigate =
    useNavigate();

  const { userInfo } =
    useSelector(
      (state) => state.auth
    );

  const [stats, setStats] =
    useState({
      totalProducts: 0,
      totalListings: 0,
      activeDeals: 0,
    });

  useEffect(() => {
    const fetchStats =
      async () => {
        try {
          const { data } =
            await api.get(
              "/listings/seller/stats"
            );

          setStats(data);
        } catch (error) {
          console.log(error);
        }
      };

    fetchStats();
  }, []);

  return (
    <div className="p-10 min-h-[80vh]">
      <h1 className="text-5xl font-bold mb-3">
        Seller Dashboard
      </h1>

      <p className="text-2xl text-gray-600 mb-10">
        Welcome back,{" "}
        {userInfo?.name}
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-5">
            Total Products
          </h2>

          <p className="text-5xl font-bold">
            {
              stats.totalProducts
            }
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-5">
            Total Listings
          </h2>

          <p className="text-5xl font-bold">
            {
              stats.totalListings
            }
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-5">
            Active Deals
          </h2>

          <p className="text-5xl font-bold">
            {
              stats.activeDeals
            }
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow">
        <h2 className="text-3xl font-bold mb-8">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-5">
          <button
            onClick={() =>
              navigate(
                "/seller/add-listing"
              )
            }
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
          >
            Add Listing
          </button>

          <button
            onClick={() =>
              navigate(
                "/seller/manage-listings"
              )
            }
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Manage Listings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;