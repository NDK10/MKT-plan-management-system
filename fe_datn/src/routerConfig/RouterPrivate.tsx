import React from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router";
import NotFound from "../pages/OtherPage/NotFound";

export default function RouterPrivate({ children }) {
  if (localStorage.getItem("accessToken") === null) {
    return children;
  } else {
    const decoded = jwtDecode(localStorage.getItem("accessToken"));
    if (decoded.role === "LEADER") return <Navigate to="/leader" replace />;
    else if (decoded.role === "EMPLOYEE")
      return <Navigate to="/employee" replace />;
    else if (decoded.role === "ADMIN") return <Navigate to="/admin" replace />;
    else {
      return <NotFound />;
    }
  }
}
