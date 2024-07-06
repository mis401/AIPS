import { useLocation, Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ? <Outlet />
            : <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />
    );
};

export default RequireAuth;