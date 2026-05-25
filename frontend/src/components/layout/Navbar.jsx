import {
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logout,
} from "../../features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [searchParams] =
    useSearchParams();

  const keywordFromUrl =
    searchParams.get("keyword") || "";

  const [keyword, setKeyword] =
    useState(keywordFromUrl);

  const authState = useSelector(
    (state) => state.auth
  );

  const userInfo =
    authState?.userInfo;

  const handleSearch = () => {
    if (!keyword.trim()) {
      navigate("/");

      return;
    }

    navigate(
      `/?keyword=${keyword}`
    );
  };

  const logoutHandler = () => {
    dispatch(logout());

    navigate("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-5">
        <h1
          className="text-3xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          PriceLens
        </h1>

        <div className="flex flex-1 max-w-xl gap-2">
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
            className="flex-1 px-4 py-2 rounded text-black"
          />

          <button
            onClick={handleSearch}
            className="bg-green-600 px-5 py-2 rounded"
          >
            Search
          </button>
        </div>

        <div className="flex gap-3 items-center">
          {userInfo ? (
            <>
              <button
                onClick={() =>
                  navigate(
                    "/seller/dashboard"
                  )
                }
                className="bg-green-600 px-4 py-2 rounded"
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  navigate("/profile")
                }
                className="bg-white text-black px-4 py-2 rounded"
              >
                {userInfo.name}
              </button>

              <button
                onClick={logoutHandler}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                navigate("/login")
              }
              className="bg-white text-black px-4 py-2 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;