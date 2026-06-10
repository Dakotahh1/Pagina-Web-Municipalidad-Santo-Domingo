import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { UserRole } from '../services/authService';

/* Componente guardián de rutas protegidas en el frontend (EP 2.5).
   - Sin sesión activa → redirige al login.
   - Con sesión pero rol no autorizado → redirige a la zona ciudadana.
   - Con sesión y rol permitido → renderiza la vista solicitada. */

interface ProtectedRouteProps extends RouteProps {
  // ComponentType<any> admite tanto componentes normales como los cargados con React.lazy.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  allowedRoles,
  ...rest
}) => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        if (allowedRoles && role && !allowedRoles.includes(role)) {
          return <Redirect to="/app/inicio" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};
