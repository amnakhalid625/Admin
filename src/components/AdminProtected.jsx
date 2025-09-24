import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtected = () => {
    // Check for user authentication from Redux store
    const user = useSelector((state) => state.auth);
    const adminInfo = useSelector((state) => state.orebiReducer?.adminInfo);
    const userInfo = useSelector((state) => state.orebiReducer?.userInfo);
    
    // Check if any user is logged in (admin or regular user)
    const isAuthenticated = user.id !== "" || adminInfo || userInfo;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
};

export default AdminProtected