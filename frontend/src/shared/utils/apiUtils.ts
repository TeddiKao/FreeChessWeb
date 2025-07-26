import api from "@appApi";
import { MoveInfo, ParsedFEN } from "../types/chessTypes/gameState.types";
import { PieceColor } from "../types/chessTypes/pieces.types";

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

async function getIsCheckmated(structuredFEN: ParsedFEN, kingColor: PieceColor) {
	let isCheckmated = null;
	try {
		const response = await api.post("/result-detection/get-is-checkmated/", {
			structured_fen: structuredFEN,
			king_color: kingColor
		});
		isCheckmated = response.data;
	} catch (error) {
		console.error(error);
	}

	return isCheckmated;
}

async function getIsStalemated(structuredFEN: ParsedFEN, kingColor: PieceColor) {
	let isStalemated = null;
	try {
		const response = await api.post("/result-detection/get-is-stalemated/", {
			structured_fen: structuredFEN,
			king_color: kingColor
		});

		isStalemated = response.data;
	} catch (error) {
		console.error(error);
	}

	return isStalemated;
}

export { getUsername, getEmail, processMove, getIsCheckmated, getIsStalemated };
