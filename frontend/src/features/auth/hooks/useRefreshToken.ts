import { useEffect, useState } from "react";
import { REFRESH_TOKEN } from "../constants";

function useRefreshToken() {
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (refreshToken) {
            setRefreshToken(refreshToken);
        }
    }, []);

    function updateRefreshToken(newRefreshToken: string) {
        localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
        setRefreshToken(newRefreshToken);
    }

    function removeRefreshToken() {
        localStorage.removeItem(REFRESH_TOKEN);
        setRefreshToken(null);
    }

    return {
        refreshToken,
        updateRefreshToken,
        removeRefreshToken,
    };
}

export default useRefreshToken;
