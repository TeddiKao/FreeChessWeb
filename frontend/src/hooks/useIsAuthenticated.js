import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api.js";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/tokens.js";
import { getAccessToken, getRefreshToken } from "../utils/tokenUtils.ts";

function useIsAuthenticated() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        auth().catch(() => {
            setIsAuthenticated(false);
        });
    }, []);

    async function refreshUserToken() {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            return;
        }

        try {
            const response = await api.post("/users_api/token/refresh/", {
                refresh: refreshToken,
            });

            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            setIsAuthenticated(false);
            console.log(error);
        }
    }

    async function auth() {
        const userAccessToken = getAccessToken();

        if (!userAccessToken) {
            setIsAuthenticated(false);
            return;
        }

        const decodedAccessToken = jwtDecode(userAccessToken);

        const accessTokenExpiry = decodedAccessToken.exp;

        const now = Date.now() / 1000;

        if (accessTokenExpiry < now) {
            await refreshUserToken();
        } else {
            setIsAuthenticated(true);
        }
    }

    return isAuthenticated;
}

export default useIsAuthenticated;
