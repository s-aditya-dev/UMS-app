import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectTo?: string;
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  redirectTo = "/auth/login",
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export { ProtectedRoute };
