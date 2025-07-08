import api from "../../app/api";

async function getUsername() {
	let username = null;
	try {
		const response = await api.get("/users_api/get-username/");
		username = response.data;
	} catch (error) {
		console.log(error);
	}

	return username;
}

async function getEmail() {
	let email = null;
	try {
		const response = await api.get("/users_api/get-email/");
		email = response.data;
	} catch (error) {
		console.log(error);
	}

	return email;
}

export { getUsername, getEmail };
