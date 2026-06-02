import { useState } from "react";

import api from "../api/axios";

const ImportProductPage = () => {
  const [url, setUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const importProduct =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const { data } =
          await api.post(
            "/admin/import/flipkart",
            {
              url,
            }
          );

        setMessage(
          `Successfully imported: ${data.product.title}`
        );

        setUrl("");
      } catch (error) {
        setMessage(
          error.response?.data
            ?.message ||
            "Import failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-3xl mx-auto p-10 min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-3">
        Import Flipkart Product
      </h1>

      <p className="text-gray-600 mb-8">
        Paste a Flipkart product URL
        and automatically add it to
        PriceLens.
      </p>

      <form
        onSubmit={importProduct}
        className="bg-white p-6 rounded-xl shadow"
      >
        <label className="block font-medium mb-2">
          Flipkart Product URL
        </label>

        <input
          type="text"
          placeholder="https://www.flipkart.com/..."
          value={url}
          onChange={(e) =>
            setUrl(
              e.target.value
            )
          }
          className="w-full border rounded-lg p-4 mb-5 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading
            ? "Importing..."
            : "Import Product"}
        </button>
      </form>

      {message && (
        <div className="mt-6 p-4 rounded-lg bg-green-100 text-green-700">
          {message}
        </div>
      )}
    </div>
  );
};

export default ImportProductPage;