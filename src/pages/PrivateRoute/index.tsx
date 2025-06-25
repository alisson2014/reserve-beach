import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import { Roles } from "../../types/user";
import { CircularProgress, Box } from '@mui/material';

interface PrivateRouteProps {
    children: JSX.Element;
    roles: Roles;
};

export default function PrivateRoute({ children, roles = [] }: PrivateRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user?.roles.some(userRole => roles.includes(userRole))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};