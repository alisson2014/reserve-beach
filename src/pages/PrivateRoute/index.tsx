import { JSX } from "react";
import { AuthService } from "../../service";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    return AuthService.getInstance().isAuthenticated() ? children : <Navigate to="/login" replace />;
};