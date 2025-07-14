import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants";

function useAccessToken() {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    function updateAccessToken(newAccessToken: string) {
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
        setAccessToken(newAccessToken);
    }

    function removeAccessToken() {
        localStorage.removeItem(ACCESS_TOKEN);
        setAccessToken(null);
    }

    useEffect(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (accessToken) {
            setAccessToken(accessToken);
        }
    }, []);

    return {
        accessToken,
        updateAccessToken,
        removeAccessToken,
    };
}

export default useAccessToken;
