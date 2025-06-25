import api from "../api.ts";

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

export {
	fetchFen,
	fetchKingIsInCheck,
	getUsername,
	fetchCompletedGames,
	fetchTotalCompletedGames,
};
