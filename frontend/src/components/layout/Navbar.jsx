import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const currentKeyword =
    searchParams.get("keyword") || "";

  const sort =
    searchParams.get("sort") || "";

  const category =
    searchParams.get("category") || "";

  const [keyword, setKeyword] =
    useState(currentKeyword);

  useEffect(() => {
    setKeyword(currentKeyword);
  }, [currentKeyword]);

  const handleSearch = () => {
    const params = {};

    if (keyword.trim()) {
      params.keyword = keyword;
    }

    if (sort) {
      params.sort = sort;
    }

    if (category) {
      params.category = category;
    }

    params.page = 1;

    navigate({
      pathname: "/",
      search:
        new URLSearchParams(
          params
        ).toString(),
    });
  };

  return (
    <nav className="bg-black text-white px-10 py-4 flex flex-col md:flex-row gap-5 md:justify-between md:items-center">
      <h1
        className="text-3xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        PriceLens
      </h1>

      <div className="flex gap-2 w-full md:w-auto">
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="px-4 py-2 rounded text-black w-full md:w-96"
        />

        <button
          onClick={handleSearch}
          className="bg-green-600 px-5 py-2 rounded"
        >
          Search
        </button>
      </div>
    </nav>
  );
};

export default Navbar;