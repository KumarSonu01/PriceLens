import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logout,
} from "../../features/auth/authSlice";

const Navbar = () => {
  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const { userInfo } =
    useSelector(
      (state) => state.auth
    );

  const [keyword, setKeyword] =
    useState("");

  const submitHandler = (
    e
  ) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(
        `/search?keyword=${keyword}`
      );
    } else {
      navigate("/");
    }
  };

  const logoutHandler = () => {
    dispatch(logout());

    navigate("/login");
  };

  return (
    <header className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-3xl font-bold">
                PriceLens
              </h1>
            </Link>
          </div>

          <form
            onSubmit={
              submitHandler
            }
            className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-2xl"
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) =>
                setKeyword(
                  e.target.value
                )
              }
              placeholder="Search products..."
              className="flex-1 px-4 py-3 rounded text-black outline-none"
            />

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded font-semibold"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            {userInfo?.role ===
              "seller" && (
              <Link
                to="/seller/dashboard"
                className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded font-semibold"
              >
                Dashboard
              </Link>
            )}

            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="bg-white text-black px-5 py-3 rounded font-semibold"
                >
                  {
                    userInfo.name
                  }
                </Link>

                <button
                  onClick={
                    logoutHandler
                  }
                  className="bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;