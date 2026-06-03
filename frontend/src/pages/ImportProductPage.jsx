import { useState } from "react";

import api from "../api/axios";

const ImportProductPage = () => {
  const [source, setSource] =
    useState("Flipkart");

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

        setMessage("");

        const endpoint =
          source === "Amazon"
            ? "/admin/import/amazon"
            : "/admin/import/flipkart";

        const { data } =
          await api.post(
            endpoint,
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
        Import Product
      </h1>

      <p className="text-gray-600 mb-8">
        Import products directly
        from Flipkart or Amazon
        into PriceLens.
      </p>

      <form
        onSubmit={importProduct}
        className="bg-white p-6 rounded-xl shadow"
      >
        <label className="block font-medium mb-2">
          Source
        </label>

        <select
          value={source}
          onChange={(e) =>
            setSource(
              e.target.value
            )
          }
          className="w-full border rounded-lg p-4 mb-5 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="Flipkart">
            Flipkart
          </option>

          <option value="Amazon">
            Amazon
          </option>
        </select>

        <label className="block font-medium mb-2">
          Product URL
        </label>

        <input
          type="text"
          placeholder={
            source === "Amazon"
              ? "https://www.amazon.in/..."
              : "https://www.flipkart.com/..."
          }
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
            : `Import ${source} Product`}
        </button>
      </form>

      {message && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            message.includes(
              "Successfully"
            )
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ImportProductPage;