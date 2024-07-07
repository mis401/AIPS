import { useLocation, Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const RedirectIfAuthenticated = () => {
    const { auth } = useAuth();
    const location = useLocation();

    console.log("RedirectIfAuthenticated - Auth user:", auth?.user);

    if (auth?.user) {
        console.log("RedirectIfAuthenticated - User found, redirecting to home");
        return <Navigate to="/home" state={{ from: location.pathname }} replace />;
    }

    console.log("RedirectIfAuthenticated - No user found, rendering outlet");
    return <Outlet />;
};

export default RedirectIfAuthenticated;
