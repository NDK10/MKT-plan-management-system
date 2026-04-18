import React from "react";

export default function EmployeeProtectedRouter({ children }) {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/" replace />;

  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (e) {
    return <Navigate to="/" replace />;
  }

  if (decoded && decoded.role === "EMPLOYEE") return children;
  return <NotFound />;
}
