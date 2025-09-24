import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtected = () => {
    // Check both auth and adminInfo from Redux
    const auth = useSelector((state) => state.auth);
    const adminInfo = useSelector((state) => state.orebiReducer?.adminInfo);
    const userInfo = useSelector((state) => state.orebiReducer?.userInfo);
    
    // Check if user is logged in (either as admin or regular user)
    const isLoggedIn = auth?.id !== "" || adminInfo?.id || userInfo?.id;
    
    // For development: Allow access if any user is logged in
    // For production: You can add role check here
    const hasAccess = isLoggedIn;
    
    console.log('AdminProtected check:', {
        auth,
        adminInfo,
        userInfo,
        isLoggedIn,
        hasAccess
    });

    return hasAccess ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtected;