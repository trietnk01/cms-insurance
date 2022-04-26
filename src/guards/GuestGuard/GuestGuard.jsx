import { PATH_NAME } from "configs";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { checkedLogin } from "redux/selector";

function GuestGuard({ children }) {
  const isAuth = useSelector(checkedLogin);
  if (isAuth) return <Navigate to={`/${PATH_NAME.ADMIN_MASTER}/${PATH_NAME.ADMIN_DASHBOARD}`} />;
  return <Fragment>{children}</Fragment>;
}

export default GuestGuard;
