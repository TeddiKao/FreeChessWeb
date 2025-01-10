import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import useIsAuthenticated from "../hooks/useIsAuthenticated.jsx";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api.js";

function AuthenticationRoute({ children }) {
    const isAuthenticated = useIsAuthenticated();

    if (isAuthenticated === null) {
        return <div>Loading ...</div>;
    }

    return isAuthenticated ? <Navigate to="/home" /> : children;
}

export default AuthenticationRoute;
