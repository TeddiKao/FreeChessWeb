import api from "@appApi";
import { MoveInfo, ParsedFEN } from "../types/chessTypes/gameState.types";

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

async function processMove(structuredFEN: ParsedFEN, moveInfo: MoveInfo) {
	let updatedStructuredFEN = null;

	try {
		const response = await api.post("/move-processing/process-move/", {
			structured_fen: structuredFEN,
			move_info: moveInfo
		});

		updatedStructuredFEN = response.data;
	} catch (error) {
		console.log(error);
	}

	return updatedStructuredFEN;
}

export { getUsername, getEmail, processMove };
