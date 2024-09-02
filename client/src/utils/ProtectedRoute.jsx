import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const ProtectedRoute = ({ requiredStatus, requiredRole }) => {
  const { user, status } = useAuth();

  console.log("User:", user);
  console.log("Status:", status);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (requiredStatus === "unauthenticated") {
    if (status !== "unauthenticated") {
      const redirectPath = user.role === "admin" ? "/admin" : "/";
      return <Navigate to={redirectPath} />;
    }
  } else {
    if (status === "unauthenticated") {
      return <Navigate to="/auth/signIn" />;
    }

    if (requiredRole && user.role !== requiredRole) {
      const redirectPath = user.role === "admin" ? "/admin" : "/";
      return <Navigate to={redirectPath} />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
