import api from "../api.ts";
import { MoveInfo, ParsedFEN } from "../features/gameplay/common/types/gameState.types.ts";
import { PieceColor } from "../features/gameplay/common/types/pieces.types.ts";


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
		const response = await api.post("/gameplay_api/get-side-to-move/", {
			game_id: gameId,
		});

		if (response.status === 200) {
			sideToMove = response.data;
		}
	} catch (error) {
		console.log(error);
	}

	return sideToMove;
}

async function fetchLegalMoves(
	parsedFENString: object,
	pieceType: string,
	pieceColor: string,
	startingSquare: string | number
) {
	let legalMoves = [];

	try {
		const response = await api.post(
			"/move_validation_api/show-legal-moves/",
			{
				parsed_fen_string: parsedFENString,
				move_info: {
					piece_color: pieceColor,
					piece_type: pieceType,
					starting_square: startingSquare,
				},
			}
		);

		if (response.status === 200) {
			legalMoves = response.data;
		}
	} catch (error) {
		console.log(error);
	}

	return legalMoves;
}

async function fetchMoveIsValid(
	parsedFENString: object,
	piece_color: string,
	piece_type: string,
	starting_square: number | string,
	destination_square: number | string,
	additional_info: object = {}
) {
	let isMoveLegal = false;
	let moveType = null;

	try {
		const response = await api.post("/move_validation_api/validate-move/", {
			parsed_fen_string: parsedFENString,
			move_info: {
				piece_color: piece_color,
				piece_type: piece_type,
				starting_square: starting_square,
				destination_square: destination_square,
				additional_info: additional_info,
			},
		});

		if (response.status === 200) {
			isMoveLegal = response.data.is_valid;
			moveType = response.data.move_type;
		}
	} catch (error) {
		console.log(error);
	}

	return [isMoveLegal, moveType];
}

async function fetchFen(rawFenString: string): Promise<any> {
	let parsedFen = null;

	try {
		const response = await api.get("/gameplay_api/parse-fen/", {
			params: {
				raw_fen_string: rawFenString,
			},
		});

		parsedFen = response.data;
	} catch (error) {
		console.log(error);
	}

	return parsedFen;
}

async function fetchKingIsInCheck(
	boardPlacement: object,
	kingColor: string,
	kingSquare: string | number
) {
	let isKingInCheck = false;

	try {
		const response = await api.post(
			"/move_validation_api/get-king-is-in-check/",
			{
				board_placement: boardPlacement,
				king_color: kingColor,
				king_square: kingSquare,
			}
		);

		if (response.status === 200) {
			isKingInCheck = response.data;
		}
	} catch (error) {
		console.log(error);
	}

	return isKingInCheck;
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

async function getIsCheckmated(currentFEN: object, kingColor: string) {
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

async function createBotGame(botId: string) {
	let gameId = null;
	let assignedColor = null;

	try {
		const response = await api.post("/bots/create-bot-game/", {
			bot: botId,
		});

		gameId = response.data["game_id"];
		assignedColor = response.data["assigned_color"];
	} catch (error) {
		console.error(error);
	}

	return [gameId, assignedColor];
}

async function makeMoveInBotGame(
	gameId: number,
	bot: string,
	moveInfo: MoveInfo
) {
	let positionData = null;

	try {
		const response = await api.post("/bots/make-move/", {
			game_id: gameId,
			bot: bot,
			move_info: moveInfo,
		});

		positionData = response.data;
	} catch (error) {
		console.error(error);
	}

	return positionData;
}

async function fetchBotGamePositionList(gameId: number) {
	let positionList = null;
	try {
		const response = await api.post("/bots/get-position-list/", {
			game_id: gameId,
		});

		positionList = response.data["position_list"];
	} catch (error) {
		console.error(error);
	}

	return positionList;
}

async function fetchBotGameMoveList(gameId: number) {
	let moveList = null;
	try {
		const response = await api.post("/bots/get-move-list/", {
			game_id: gameId,
		});

		moveList = response.data["move_list"];
	} catch (error) {
		console.error(error);
	}

	return moveList;
}

async function fetchCompletedGames(currentPage: number) {
	let completedGames = null;
	try {
		const response = await api.post("/game-history/get-completed-games/", {
			current_page: currentPage,
		});

		completedGames = response.data;
	} catch (error) {
		console.error(error);
	}

	return completedGames;
}

async function fetchTotalCompletedGames() {
	let totalCompletedGames = null;
	try {
		const response = await api.post(
			"/game-history/get-total-completed-games/"
		);

		totalCompletedGames = response.data;
	} catch (error) {
		console.error(error);
	}

	return totalCompletedGames;
}

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

export {
	fetchFen,
	fetchKingIsInCheck,
	fetchLegalMoves,
	fetchMoveIsValid,
	getIsCheckmated,
	getIsStalemated,
	getUsername,
	fetchCurrentPosition,
	fetchTimer,
	fetchPositionList,
	fetchMoveList,
	createBotGame,
	makeMoveInBotGame,
	fetchBotGameMoveList,
	fetchBotGamePositionList,
	fetchCompletedGames,
	fetchGameWinner,
	fetchTotalCompletedGames,
	fetchSideToMove,
};
