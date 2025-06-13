import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../Profile/Profile";

const ProfilePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem("user");
        if (!user) {
            // Redirect to login page if not logged in
            navigate("/login");
        }
    }, [navigate]);

    return (
        <Profile />
    );
};

export default ProfilePage; 