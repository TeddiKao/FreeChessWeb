import axios from "axios";
import { getAccessToken } from "../features/auth/utils";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
	(config) => {
		const accessToken = getAccessToken();
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},

	(error) => {
		return Promise.reject(error);
	}
);

export default api;
