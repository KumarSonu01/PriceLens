import {
  useRef,
} from "react";

import {
  useSelector,
} from "react-redux";

import api from "../api/axios";

const ProfilePage = () => {
  const { userInfo } =
    useSelector(
      (state) => state.auth
    );

  const fileInputRef =
    useRef(null);

  const handleUpload =
    () => {
      fileInputRef.current?.click();
    };

  const handleAvatarUpload =
    async (e) => {
      try {
        const file =
          e.target.files[0];

        if (!file) return;

        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        const { data } =
          await api.post(
            "/upload/avatar",
            formData
          );

        await api.put(
          "/auth/profile",
          {
            avatar:
              data.imageUrl,
          }
        );

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };

  const handleRemove =
    async () => {
      try {
        await api.delete(
          "/upload/avatar"
        );

        await api.put(
          "/auth/profile",
          {
            avatar: "",
          }
        );

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow p-10">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div className="flex-shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={
                handleAvatarUpload
              }
            />

            {userInfo?.avatar ? (
              <img
                src={
                  userInfo.avatar
                }
                alt={
                  userInfo.name
                }
                className="w-40 h-40 rounded-full object-cover border-4 border-green-500 shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-black text-white flex items-center justify-center text-5xl font-bold">
                {userInfo.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={
                  handleUpload
                }
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Change Photo
              </button>

              <button
                onClick={
                  handleRemove
                }
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Remove Photo
              </button>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-5xl font-extrabold mb-10">
              Profile
            </h1>

            <div className="space-y-6 text-xl">
              <p>
                <span className="font-bold">
                  Name:
                </span>{" "}
                {
                  userInfo.name
                }
              </p>

              <p>
                <span className="font-bold">
                  Email:
                </span>{" "}
                {
                  userInfo.email
                }
              </p>

              <p>
                <span className="font-bold">
                  Role:
                </span>{" "}
                {
                  userInfo.role
                }
              </p>

              {userInfo.shopName && (
                <p>
                  <span className="font-bold">
                    Shop:
                  </span>{" "}
                  {
                    userInfo.shopName
                  }
                </p>
              )}

              {userInfo.city && (
                <p>
                  <span className="font-bold">
                    City:
                  </span>{" "}
                  {
                    userInfo.city
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;