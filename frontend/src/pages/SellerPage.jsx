import {
  useNavigate,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

const SellerPage = () => {
  const navigate = useNavigate();

  const { userInfo } = useSelector(
    (state) => state.auth
  );

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold mb-3">
        Seller Dashboard
      </h1>

      <p className="text-2xl text-gray-600 mb-10">
        Welcome back, {userInfo?.name}
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-5">
            Total Products
          </h2>

          <p className="text-5xl font-bold">
            0
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-5">
            Total Listings
          </h2>

          <p className="text-5xl font-bold">
            0
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-5">
            Active Deals
          </h2>

          <p className="text-5xl font-bold">
            0
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
                "/seller/add-product"
              )
            }
            className="bg-black text-white px-6 py-3 rounded"
          >
            Add Product
          </button>

          <button
            onClick={() =>
              navigate(
                "/seller/add-listing"
              )
            }
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Add Listing
          </button>

          <button
            onClick={() =>
              navigate(
                "/seller/manage-listings"
              )
            }
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Manage Listings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;