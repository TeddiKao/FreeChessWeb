import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { ACCESS_TOKEN } from "@auth/constants";
import { getAccessToken, getRefreshToken } from "@auth/utils";
import api from "@appApi";
import useAccessToken from "./useAccessToken";

function useIsAuthenticated() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
		null
	);
	const { updateAccessToken } = useAccessToken();

	useEffect(() => {
		auth().catch(() => {
			setIsAuthenticated(false);
		});
	}, []);

	async function refreshUserToken(): Promise<void> {
		const refreshToken = getRefreshToken();
		if (!refreshToken) {
			return;
		}

		try {
			const response = await api.post("/users_api/token/refresh/", {
				refresh: refreshToken,
			});

			if (response.status === 200) {
				updateAccessToken(response.data.access);
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		} catch (error) {
			setIsAuthenticated(false);
			console.log(error);
		}
	}

	async function auth(): Promise<void> {
		const userAccessToken = getAccessToken();

		if (!userAccessToken) {
			setIsAuthenticated(false);
			return;
		}

		const decodedAccessToken: any = jwtDecode(userAccessToken);
		const accessTokenExpiry: any = decodedAccessToken.exp;
		const now: number = Date.now() / 1000;

		if (accessTokenExpiry < now) {
			await refreshUserToken();
		} else {
			setIsAuthenticated(true);
		}
	}

	return isAuthenticated;
}

export default useIsAuthenticated;
