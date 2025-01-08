import { useEffect, useState } from "react"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AuthenticationRoute({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(null)

	useEffect(() => {
		auth().catch(() => {
			setIsAuthenticated(false);
		})
	}, [])

	async function refreshUserToken() {
		const refreshToken = localStorage.getItem(REFRESH_TOKEN)
		if (!refreshToken) {
			return;
		}

		try {
			const response = await api.post("/users_api/create-user/", {
				refresh: refreshToken
			})

			if (response.status === 200) {
				localStorage.setItem(ACCESS_TOKEN, response.data.access)
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}

		} catch (error) {
			setIsAuthenticated(false);
			console.log(error)
		}
	}

	async function auth() {
		const userAccessToken = localStorage.getItem(ACCESS_TOKEN)
		console.log(userAccessToken)

		if (!userAccessToken) {
			console.log(userAccessToken)
			setIsAuthenticated(false);
			return;
		}

		const decodedAccessToken = jwtDecode(userAccessToken)
		console.log(decodedAccessToken);

		const accessTokenExpiry = decodedAccessToken.exp
		const now = Date.now() / 1000

		console.log(accessTokenExpiry);

		if (accessTokenExpiry < now) {
			await refreshUserToken()
		} else {
			setIsAuthenticated(true);
			console.log("You are authenticated!")
		}
	}

	if (isAuthenticated === null) {
		return <div>Loading ...</div>
	}

	console.log(isAuthenticated)

	return isAuthenticated ? <Navigate to="/home"/> : children
}

export default AuthenticationRoute