import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts";

type Role = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';

interface PrivateRouteProps {
    children: JSX.Element;
    roles: Role[];
};

export default function PrivateRoute({ children, roles = [] }: PrivateRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Carregando...</div>; // Ou um componente de Spinner
    }

    if(roles.length <= 0) {
        throw new Error("PrivateRoute requires at least one role to be specified.");
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};