import {
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

const SellerDashboard = () => {
  const navigate = useNavigate();

  const { userInfo } = useSelector(
    (state) => state.auth
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">
            Seller Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Welcome back,{" "}
            {userInfo?.name}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            Total Products
          </h2>

          <p className="text-5xl font-bold mt-5">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            Total Listings
          </h2>

          <p className="text-5xl font-bold mt-5">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            Active Deals
          </h2>

          <p className="text-5xl font-bold mt-5">
            0
          </p>
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-5">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() =>
              navigate(
                "/seller/add-product"
              )
            }
            className="bg-black text-white px-6 py-3 rounded"
          >
            Add Product
          </button>

          <button className="bg-green-600 text-white px-6 py-3 rounded">
            Add Listing
          </button>

          <button className="bg-blue-600 text-white px-6 py-3 rounded">
            Manage Listings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;