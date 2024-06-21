import React from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ roles }) => {
  const token = Cookies.get("jwt_token");
  const location = useLocation();
  if (!token) {
    window.location.href = "https://animewebnew.netlify.app/NotAuthorized";
  }
  try {
    const decodedToken = jwtDecode(token);
    const userRoles = decodedToken.scope.split(" ");
    if (roles && !roles.some((role) => userRoles.includes(role))) {
      window.location.href = "https://animewebnew.netlify.app/NotAuthorized";
      return null;
    }
    return <Outlet />;
  } catch (error) {
    window.location.href = "https://animewebnew.netlify.app/NotAuthorized";
  }
};

export default PrivateRoute;
