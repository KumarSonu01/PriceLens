import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

const SellerRoute = () => {
  const { userInfo } =
    useSelector(
      (state) => state.auth
    );

  if (!userInfo) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    userInfo.role !==
    "local_seller"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};

export default SellerRoute;