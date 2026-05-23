import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactElement;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
}