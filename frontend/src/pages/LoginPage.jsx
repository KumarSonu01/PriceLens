import {
  useState,
  useEffect,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import toast from "react-hot-toast";

import api from "../api/axios";

import {
  setCredentials,
} from "../features/auth/authSlice";

const LoginPage = () => {
  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const { userInfo } =
    useSelector(
      (state) => state.auth
    );

  useEffect(() => {
    if (userInfo) {
      if (
        userInfo.role ===
          "online_seller" ||
        userInfo.role ===
          "local_seller"
      ) {
        navigate(
          "/seller/dashboard"
        );
      } else {
        navigate("/");
      }
    }
  }, [navigate, userInfo]);

  const submitHandler =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const { data } =
          await api.post(
            "/auth/login",
            {
              email,
              password,
            }
          );

        dispatch(
          setCredentials(data)
        );

        toast.success(
          "Login successful"
        );

        if (
          data.role ===
            "online_seller" ||
          data.role ===
            "local_seller"
        ) {
          navigate(
            "/seller/dashboard"
          );
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Login failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-black text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-black to-black" />

        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold">
            Welcome Back
          </h1>

          <p className="text-2xl mt-6 text-gray-300 leading-relaxed max-w-xl">
            Continue your
            smarter shopping
            experience with
            PriceLens.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold">
              Login
            </h2>

            <p className="text-gray-500 mt-3">
              Access your
              PriceLens account
            </p>
          </div>

          <form
            onSubmit={
              submitHandler
            }
            className="space-y-5"
          >
            <div>
              <label className="font-semibold block mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl font-bold"
            >
              {loading
                ? "Logging In..."
                : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Don't have an
            account?{" "}
            <Link
              to="/register"
              className="font-semibold text-black"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;