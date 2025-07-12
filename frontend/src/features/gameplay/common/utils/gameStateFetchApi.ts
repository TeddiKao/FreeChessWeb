import api from "@appApi";
import { ParsedFEN } from "@sharedTypes/chessTypes/gameState.types";
import { PieceColor } from "@sharedTypes/chessTypes/pieces.types";

async function fetchCurrentPosition(gameId: number): Promise<ParsedFEN> {
	let currentPosition = null;

	try {
		const response = await api.post("gameplay_api/get-current-position/", {
			game_id: gameId,
		});

		if (response.status === 200) {
			currentPosition = response.data;
		}
	} catch (error) {
		console.error(error);
	}

	return currentPosition;
}

async function fetchTimer(gameId: number, playerColor: PieceColor) {
	let timer = null;
	try {
		const response = await api.post("gameplay_api/get-player-timer/", {
			game_id: gameId,
			player_color: playerColor,
		});

		if (response.status === 200) {
			timer = response.data;
		}
	} catch (error) {
		console.error(error);
	}

	return timer;
}

async function fetchPositionList(gameId: number) {
	let positionList = null;
	try {
		const response = await api.post("gameplay_api/get-position-list/", {
			game_id: gameId,
		});

		if (response.status === 200) {
			positionList = response.data;
		}
	} catch (error) {
		console.error(error);
	}

	return positionList;
}

async function fetchMoveList(gameId: number) {
	let moveList = null;
	try {
		const response = await api.post("gameplay_api/get-move-list/", {
			game_id: gameId,
		});

		if (response.status === 200) {
			moveList = response.data;
		}
	} catch (error) {
		console.error(error);
	}

	return moveList;
}

async function fetchSideToMove(gameId: number) {
	let sideToMove = null;

	try {
		const response = await api.post("gameplay_api/get-side-to-move/", {
			game_id: gameId,
		});

		if (response.status === 200) {
			sideToMove = response.data;
		}
	} catch (error) {
		console.error(error);
	}

	return sideToMove;
}

export {
	fetchCurrentPosition,
	fetchTimer,
	fetchPositionList,
	fetchMoveList,
	fetchSideToMove,
};
