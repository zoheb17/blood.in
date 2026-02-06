import React from "react";
import { Navigate } from "react-router";

/**
 * Simple protected route wrapper.
 * Redirects to /login when there is no JWT token in localStorage.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

