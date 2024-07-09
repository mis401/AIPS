import { useLocation, Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (!auth?.user) {
        return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }

    if (!allowedRoles.includes(auth.user.role)) {
        return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
