import { useLocation, Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const { auth } = useAuth();
    const location = useLocation();

    console.log("RequireAuth", auth?.user, allowedRoles);

    return (
        allowedRoles.includes(auth?.user?.role || "")
            ? <Outlet />
            : auth?.user 
                ? <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />
                : <Navigate to="/auth" state={{ from: location.pathname }} replace />
    );
};

export default RequireAuth;