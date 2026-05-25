import { useState } from "react";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="bg-black text-white px-10 py-4 flex justify-between items-center">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        PriceLens
      </h1>

      <form
        onSubmit={handleSearch}
        className="flex gap-2"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
          className="px-4 py-2 rounded text-black w-80"
        />

        <button
          type="submit"
          className="bg-green-600 px-5 py-2 rounded"
        >
          Search
        </button>
      </form>
    </nav>
  );
};

export default Navbar;