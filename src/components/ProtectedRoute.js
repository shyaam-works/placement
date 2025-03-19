// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";

const ProtectedRoute = () => {
  const [authStatus, setAuthStatus] = useState(null); // null = loading, true = authenticated, false = unauthenticated

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Use axiosInstance to make a request to a protected endpoint
        await axiosInstance.get("/");
        setAuthStatus(true);
      } catch (err) {
        console.error("Auth verification failed:", err.response);
        setAuthStatus(false);
      }
    };
    verifyAuth();
  }, []);

  if (authStatus === null) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return authStatus ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
