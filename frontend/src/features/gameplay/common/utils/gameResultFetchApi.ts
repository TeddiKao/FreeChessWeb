import api from "../../../../app/api";
import { ParsedFEN } from "../../../../shared/types/chessTypes/gameState.types";

async function fetchGameWinner(gameId: number) {
	let gameWinner = null;
	try {
		const response = await api.post("/game-history/get-game-winner/", {
			game_id: gameId,
		});

		gameWinner = response.data;
	} catch (error) {
		console.error(error);
	}

	return gameWinner;
}

async function getIsStalemated(currentFEN: ParsedFEN, kingColor: string) {
	let isStalemated = false;
	try {
		const response = await api.post(
			"/move_validation_api/get-is-stalemated/",
			{
				current_fen: currentFEN,
				king_color: kingColor,
			}
		);

		if (response.status === 200) {
			isStalemated = response.data;
		}
	} catch (error) {
		console.log(error);
	}

	return isStalemated;
}

async function getIsCheckmated(currentFEN: ParsedFEN, kingColor: string) {
	let isCheckmated = false;

	try {
		const response = await api.post(
			"/move_validation_api/get-is-checkmated/",
			{
				current_fen: currentFEN,
				king_color: kingColor,
			}
		);

		if (response.status === 200) {
			isCheckmated = response.data;
		}
	} catch (error) {
		console.log(error);
	}

	return isCheckmated;
}

export { fetchGameWinner, getIsStalemated, getIsCheckmated };
