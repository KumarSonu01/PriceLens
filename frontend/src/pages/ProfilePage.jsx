import {
  useSelector,
} from "react-redux";

const ProfilePage = () => {
  const { userInfo } = useSelector(
    (state) => state.auth
  );

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-10">
      <div className="bg-white p-10 rounded-lg shadow">
        <h1 className="text-4xl font-bold mb-8">
          Profile
        </h1>

        <div className="space-y-5 text-xl">
          <div>
            <span className="font-bold">
              Name:
            </span>{" "}
            {userInfo?.name}
          </div>

          <div>
            <span className="font-bold">
              Email:
            </span>{" "}
            {userInfo?.email}
          </div>

          <div>
            <span className="font-bold">
              Role:
            </span>{" "}
            {userInfo?.role}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;