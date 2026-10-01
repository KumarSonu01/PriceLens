import {
  useRef,
  useEffect,
  useState,
} from "react";

import {
  useSelector,
} from "react-redux";

import toast from "react-hot-toast";

import api from "../api/axios";


const ProfilePage = () => {
  const { userInfo } =
    useSelector(
      (state) => state.auth
    );

  const fileInputRef =
    useRef(null);


  const [
    storeLink,
    setStoreLink,
  ] = useState("");


  const [
    savingStoreLink,
    setSavingStoreLink,
  ] = useState(false);


  // ==========================================
  // LOAD SELLER PROFILE
  // ==========================================
  useEffect(() => {
    const loadSellerProfile =
      async () => {
        if (
          userInfo?.role !==
          "local_seller"
        ) {
          return;
        }

        try {
          const { data } =
            await api.get(
              "/sellers/profile"
            );

          setStoreLink(
            data?.storeLink || ""
          );
        } catch (error) {
          console.log(
            "Seller profile error:",
            error
          );
        }
      };

    loadSellerProfile();
  }, [userInfo]);


  // ==========================================
  // AVATAR
  // ==========================================
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

        toast.error(
          "Image upload failed"
        );
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

        toast.error(
          "Failed to remove photo"
        );
      }
    };


  // ==========================================
  // SAVE STORE LINK
  // ==========================================
  const handleSaveStoreLink =
    async () => {
      try {
        setSavingStoreLink(true);

        let normalizedLink =
          storeLink.trim();


        if (
          normalizedLink &&
          !/^https?:\/\//i.test(
            normalizedLink
          )
        ) {
          normalizedLink =
            `https://${normalizedLink}`;
        }


        const { data } =
          await api.put(
            "/sellers/profile",
            {
              storeLink:
                normalizedLink,
            }
          );


        setStoreLink(
          data?.storeLink || ""
        );


        toast.success(
          "Store link updated"
        );

      } catch (error) {
        console.log(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update store link"
        );

      } finally {
        setSavingStoreLink(false);
      }
    };


  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="bg-white rounded-3xl shadow p-10">

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">

          {/* AVATAR */}

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
                {userInfo?.name
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


          {/* PROFILE */}

          <div className="flex-1">

            <h1 className="text-5xl font-extrabold mb-10">
              Profile
            </h1>


            <div className="space-y-6 text-xl">

              <p>
                <span className="font-bold">
                  Name:
                </span>{" "}
                {userInfo?.name}
              </p>

              <p>
                <span className="font-bold">
                  Email:
                </span>{" "}
                {userInfo?.email}
              </p>

              <p>
                <span className="font-bold">
                  Role:
                </span>{" "}
                {userInfo?.role}
              </p>

              {userInfo?.shopName && (
                <p>
                  <span className="font-bold">
                    Shop:
                  </span>{" "}
                  {userInfo.shopName}
                </p>
              )}

              {userInfo?.city && (
                <p>
                  <span className="font-bold">
                    City:
                  </span>{" "}
                  {userInfo.city}
                </p>
              )}

            </div>


            {/* STORE LINK */}

            {userInfo?.role ===
              "local_seller" && (

              <div className="mt-10 border-t pt-8">

                <h2 className="text-2xl font-bold mb-2">
                  Store Link
                </h2>

                <p className="text-gray-500 mb-5">
                  Add your website,
                  online store, WhatsApp
                  catalog, Instagram page,
                  or business page.
                </p>


                <div className="flex flex-col md:flex-row gap-3">

                  <input
                    type="url"
                    value={
                      storeLink
                    }
                    onChange={(e) =>
                      setStoreLink(
                        e.target.value
                      )
                    }
                    placeholder="https://yourstore.com"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />


                  <button
                    onClick={
                      handleSaveStoreLink
                    }
                    disabled={
                      savingStoreLink
                    }
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    {savingStoreLink
                      ? "Saving..."
                      : "Save Link"}
                  </button>

                </div>


                {storeLink && (
                  <a
                    href={
                      storeLink
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-green-700 font-semibold hover:underline"
                  >
                    Open Store →
                  </a>
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;