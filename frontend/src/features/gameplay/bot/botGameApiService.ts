import api from "../../../app/api";
import { MoveInfo } from "../common/types/gameState.types";

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

export {
    createBotGame,
    makeMoveInBotGame,
    fetchBotGamePositionList,
    fetchBotGameMoveList,
};