import React from 'react';
import { useRouteError, isRouteErrorResponse, Navigate } from 'react-router-dom';

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  // Handle 404s and other routing errors by redirecting to home
  if (isRouteErrorResponse(error)) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/" replace />;
}; 