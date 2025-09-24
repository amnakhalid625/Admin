import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtected = () => {
    const user = useSelector((state) => state.auth);
    const location = useLocation();

    // Agar user authenticated nahi hai toh login par redirect karo
    if (!user.id) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Optional: Agar role check karna hai toh
    // if (user.role !== "admin") {
    //     return <Navigate to="/unauthorized" replace />;
    // }

    return <Outlet />;
};

export default AdminProtected;