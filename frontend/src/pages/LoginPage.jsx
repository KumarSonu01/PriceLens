import {
  useState,
} from "react";

import {
  useDispatch,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

import {
  setCredentials,
} from "../features/auth/authSlice";

const LoginPage = () => {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const submitHandler = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const { data } = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      dispatch(setCredentials(data));

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={submitHandler}
        className="bg-white p-10 rounded-lg shadow w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-8">
          Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-5">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;