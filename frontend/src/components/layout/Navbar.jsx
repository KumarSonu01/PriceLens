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
  FaHeart,
  FaBell,
} from "react-icons/fa";

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
    <header className="bg-black text-white sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <Link
            to="/"
            className="shrink-0"
          >
            <h1 className="text-4xl font-black tracking-tight">
              PriceLens
            </h1>
          </Link>

          <form
            onSubmit={
              submitHandler
            }
            className="flex flex-1 gap-3 max-w-3xl"
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
              className="flex-1 px-5 py-3 rounded-2xl text-black outline-none border-2 border-transparent focus:border-green-500 transition"
            />

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-2xl font-semibold"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            {userInfo && (
              <>
                <Link
                  to="/wishlist"
                  className="bg-white/10 hover:bg-white/20 transition text-white px-4 py-3 rounded-2xl font-medium flex items-center gap-2 backdrop-blur"
                >
                  <FaHeart className="text-red-400" />
                </Link>

                <Link
                  to="/alerts"
                  className="bg-yellow-400 hover:bg-yellow-300 transition text-black px-4 py-3 rounded-2xl font-medium flex items-center gap-2"
                >
                  <FaBell />
                </Link>
              </>
            )}

            {(userInfo?.role ===
              "online_seller" ||
              userInfo?.role ===
                "local_seller" ||
              userInfo?.role ===
                "admin") && (
              <Link
                to="/seller/dashboard"
                className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded-2xl font-medium"
              >
                Dashboard
              </Link>
            )}

            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="bg-white/10 hover:bg-white/20 transition px-3 py-2 rounded-2xl font-medium flex items-center gap-3"
                >
                  {userInfo?.avatar ? (
                    <img
                      src={
                        userInfo.avatar
                      }
                      alt={
                        userInfo.name
                      }
                      className="w-10 h-10 rounded-full object-cover border border-white"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">
                      {userInfo.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>
                  )}

                  <span className="hidden sm:block">
                    {
                      userInfo.name
                    }
                  </span>
                </Link>

                <button
                  onClick={
                    logoutHandler
                  }
                  className="bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-2xl font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded-2xl font-medium"
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