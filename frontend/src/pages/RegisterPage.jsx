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

const RegisterPage = () => {
  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const { userInfo } =
    useSelector(
      (state) => state.auth
    );

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [role, setRole] =
    useState("buyer");

  const [avatar, setAvatar] =
    useState("");

  const [
    avatarPreview,
    setAvatarPreview,
  ] = useState("");

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [
    adminSecretKey,
    setAdminSecretKey,
  ] = useState("");

  const [
    shopName,
    setShopName,
  ] = useState("");

  const [
    shopAddress,
    setShopAddress,
  ] = useState("");

  const [city, setCity] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    deliveryRadius,
    setDeliveryRadius,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const uploadAvatarHandler =
    async (e) => {
      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      try {
        setUploadingImage(true);

        const { data } =
          await api.post(
            "/upload/avatar",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setAvatar(
          data.imageUrl
        );

        setAvatarPreview(
          data.imageUrl
        );

        toast.success(
          "Avatar uploaded"
        );
      } catch (error) {
        console.log(error);

        toast.error(
          "Image upload failed"
        );
      } finally {
        setUploadingImage(false);
      }
    };

  const submitHandler =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const { data } =
          await api.post(
            "/auth/register",
            {
              name,

              email,

              password,

              role,

              avatar,

              adminSecretKey,

              shopName,

              shopAddress,

              city,

              phone,

              deliveryRadius,
            }
          );

        dispatch(
          setCredentials(data)
        );

        toast.success(
          "Account created successfully"
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
        } else if (
          data.role ===
          "admin"
        ) {
          navigate(
            "/admin/dashboard"
          );
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Registration failed"
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
          <h1 className="text-6xl font-extrabold leading-tight">
            PriceLens
          </h1>

          <p className="text-2xl mt-6 text-gray-300 leading-relaxed max-w-xl">
            Compare prices,
            track deals,
            discover nearby
            sellers, and shop
            smarter with real
            market intelligence.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold">
              Create Account
            </h2>

            <p className="text-gray-500 mt-3">
              Join PriceLens
            </p>
          </div>

          <form
            onSubmit={
              submitHandler
            }
            className="space-y-5"
          >
            <div>
              <label className="font-semibold block mb-3">
                Profile Avatar
              </label>

              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border">
                  {avatarPreview ? (
                    <img
                      src={
                        avatarPreview
                      }
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      uploadAvatarHandler
                    }
                  />

                  {uploadingImage && (
                    <p className="text-sm text-gray-500 mt-2">
                      Uploading...
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />
            </div>

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
                minLength={6}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold block mb-4">
                Choose Account
                Type
              </label>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setRole(
                      "buyer"
                    )
                  }
                  className={`border rounded-2xl p-4 ${
                    role ===
                    "buyer"
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  🛒 Buyer
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRole(
                      "online_seller"
                    )
                  }
                  className={`border rounded-2xl p-4 ${
                    role ===
                    "online_seller"
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  🌐 Online Seller
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRole(
                      "local_seller"
                    )
                  }
                  className={`border rounded-2xl p-4 ${
                    role ===
                    "local_seller"
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  🏪 Local Seller
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRole(
                      "admin"
                    )
                  }
                  className={`border rounded-2xl p-4 ${
                    role ===
                    "admin"
                      ? "bg-red-600 text-white"
                      : "bg-white"
                  }`}
                >
                  🛡️ Administrator
                </button>
              </div>
            </div>

            {role ===
              "admin" && (
              <div className="border-t pt-6">
                <label className="font-semibold block mb-2 text-red-600">
                  Admin Secret
                  Key
                </label>

                <input
                  type="password"
                  value={
                    adminSecretKey
                  }
                  onChange={(e) =>
                    setAdminSecretKey(
                      e.target.value
                    )
                  }
                  required
                  placeholder="Enter admin secret key"
                  className="w-full border border-red-300 rounded-xl px-4 py-3 outline-none"
                />
              </div>
            )}

            {role ===
              "local_seller" && (
              <div className="space-y-5 border-t pt-6">
                <input
                  type="text"
                  placeholder="Shop Name"
                  value={shopName}
                  onChange={(e) =>
                    setShopName(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                />

                <input
                  type="text"
                  placeholder="Shop Address"
                  value={
                    shopAddress
                  }
                  onChange={(e) =>
                    setShopAddress(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                />

                <input
                  type="number"
                  placeholder="Delivery Radius"
                  value={
                    deliveryRadius
                  }
                  onChange={(e) =>
                    setDeliveryRadius(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                uploadingImage
              }
              className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl font-bold"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Already have an
            account?{" "}
            <Link
              to="/login"
              className="font-semibold text-black"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;