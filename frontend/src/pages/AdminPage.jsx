import {
  useNavigate,
} from "react-router-dom";

const AdminPage = () => {
  const navigate =
    useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-10">
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mt-3 text-lg">
          Manage products and
          listings.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() =>
            navigate(
              "/admin/add-product"
            )
          }
          className="bg-black text-white p-8 rounded-xl"
        >
          Add Product
        </button>

        <button
          onClick={() =>
            navigate(
              "/admin/manage-products"
            )
          }
          className="bg-purple-600 text-white p-8 rounded-xl"
        >
          Manage Products
        </button>

        <button
          onClick={() =>
            navigate(
              "/admin/listings"
            )
          }
          className="bg-blue-600 text-white p-8 rounded-xl"
        >
          View All Listings
        </button>
      </div>
    </div>
  );
};

export default AdminPage;