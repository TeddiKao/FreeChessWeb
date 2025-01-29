import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/tokens"

function getAccessToken() {
	return localStorage.getItem(ACCESS_TOKEN);
}

function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
}

export { getAccessToken, getRefreshToken }