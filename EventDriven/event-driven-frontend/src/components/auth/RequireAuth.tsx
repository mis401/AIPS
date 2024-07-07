import { useLocation, Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const { auth } = useAuth();
    const location = useLocation();

    console.log("RequireAuth - Auth user:", auth?.user);
    console.log("RequireAuth - Allowed roles:", allowedRoles);

    if (!auth?.user) {
        console.log("RequireAuth - No user found, redirecting to auth");
        return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }

    if (!allowedRoles.includes(auth.user.role)) {
        console.log("RequireAuth - User role not allowed, redirecting to unauthorized");
        return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
    }

    console.log("RequireAuth - User authorized, rendering outlet");
    return <Outlet />;
};

export default RequireAuth;
