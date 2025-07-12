import api from "@appApi";

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


export { fetchCompletedGames, fetchTotalCompletedGames };