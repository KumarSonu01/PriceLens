import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import api from "../api/axios";

const ComparePage = () => {
  const [products, setProducts] =
    useState([]);

  const [
    comparisonRows,
    setComparisonRows,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchParams] =
    useSearchParams();

  useEffect(() => {
    const fetchComparison =
      async () => {
        try {
          const ids =
            searchParams.get(
              "ids"
            );

          const { data } =
            await api.get(
              `/comparison?ids=${ids}`
            );

          setProducts(
            data.products
          );

          setComparisonRows(
            data.comparisonRows
          );
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    fetchComparison();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading comparison...
      </div>
    );
  }

  if (
    products.length < 2
  ) {
    return (
      <div className="p-10 text-center">
        Select at least 2
        products to compare.
      </div>
    );
  }

  const lowestPrice =
    Math.min(
      ...products.map(
        (product) =>
          product.lowestPrice
      )
    );

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">
        Product Comparison
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-4 text-left bg-gray-50 min-w-[180px]">
                Specification
              </th>

              {products.map(
                (product) => (
                  <th
                    key={
                      product._id
                    }
                    className="border p-4 min-w-[280px]"
                  >
                    <img
                      src={
                        product
                          .images?.[0]
                      }
                      alt={
                        product.title
                      }
                      className="w-36 h-36 object-cover mx-auto rounded-lg mb-3"
                    />

                    <h2 className="font-bold text-lg">
                      {
                        product.title
                      }
                    </h2>

                    <p className="text-green-600 font-semibold mt-2">
                      ₹
                      {product.lowestPrice?.toLocaleString()}
                    </p>
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-4 font-semibold bg-gray-50">
                Brand
              </td>

              {products.map(
                (product) => (
                  <td
                    key={
                      product._id +
                      "brand"
                    }
                    className="border p-4"
                  >
                    {
                      product.brand
                    }
                  </td>
                )
              )}
            </tr>

            <tr>
              <td className="border p-4 font-semibold bg-gray-50">
                Category
              </td>

              {products.map(
                (product) => (
                  <td
                    key={
                      product._id +
                      "category"
                    }
                    className="border p-4"
                  >
                    {
                      product.category
                    }
                  </td>
                )
              )}
            </tr>

            <tr>
              <td className="border p-4 font-semibold bg-gray-50">
                Rating
              </td>

              {products.map(
                (product) => (
                  <td
                    key={
                      product._id +
                      "rating"
                    }
                    className="border p-4"
                  >
                    ⭐{" "}
                    {product.overallRating ||
                      "-"}
                  </td>
                )
              )}
            </tr>

            <tr>
              <td className="border p-4 font-semibold bg-gray-50">
                Lowest Price
              </td>

              {products.map(
                (product) => (
                  <td
                    key={
                      product._id +
                      "price"
                    }
                    className={`border p-4 font-semibold ${
                      product.lowestPrice ===
                      lowestPrice
                        ? "bg-green-100 text-green-700"
                        : "text-green-600"
                    }`}
                  >
                    ₹
                    {product.lowestPrice?.toLocaleString()}
                  </td>
                )
              )}
            </tr>

            <tr>
              <td className="border p-4 font-semibold bg-gray-50">
                Key Features
              </td>

              {products.map(
                (product) => (
                  <td
                    key={
                      product._id +
                      "features"
                    }
                    className="border p-4"
                  >
                    <ul className="list-disc pl-4 space-y-1">
                      {product.features
                        ?.slice(0, 5)
                        .map(
                          (
                            feature,
                            index
                          ) => (
                            <li
                              key={
                                index
                              }
                            >
                              {
                                feature
                              }
                            </li>
                          )
                        )}
                    </ul>
                  </td>
                )
              )}
            </tr>

            {comparisonRows.map(
              (row) => (
                <tr
                  key={row.spec}
                >
                  <td className="border p-4 font-semibold bg-gray-50">
                    {
                      row.spec
                    }
                  </td>

                  {row.values.map(
                    (
                      value,
                      index
                    ) => (
                      <td
                        key={
                          row.spec +
                          index
                        }
                        className="border p-4"
                      >
                        {value}
                      </td>
                    )
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;