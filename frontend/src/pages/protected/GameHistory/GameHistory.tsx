import { useEffect, useRef, useState } from "react";
import useCompletedGames from "../../../hooks/useCompletedGames";

import "../../../styles/pages/game-history.scss";
import CompletedGameInfo from "../../../features/gameHistory/components/CompletedGameInfo";
import useUsername from "../../../hooks/useUsername";
import { isNullOrUndefined } from "../../../utils/generalUtils";
import PageNavigation from "../../../features/gameHistory/components/PageNavigation";
import { getTotalPages } from "../../../utils/pageNavigationUtils";
import DashboardNavbar from "../../../components/common/DashboardNavbar/DashboardNavbar";

function GameHistory() {
	const initialUsername = useUsername();

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [gamesPerPage, setGamesPerPage] = useState<number>(20);

	const { initialCompletedGames, initialTotalCompletedGames } =
		useCompletedGames(currentPage);

	const [completedGames, setCompletedGames] = useState(initialCompletedGames);
	const [totalCompletedGames, setTotalCompletedGamees] = useState(
		initialTotalCompletedGames
	);
	const [username, setUsername] = useState(initialUsername);

	useEffect(() => {
		setCompletedGames(initialCompletedGames);
	}, [initialCompletedGames]);

	useEffect(() => {
		setUsername(initialUsername);
	}, [initialUsername]);

	useEffect(() => {
		setTotalCompletedGamees(initialTotalCompletedGames);
	}, [initialTotalCompletedGames]);

	if (
		isNullOrUndefined(completedGames) ||
		isNullOrUndefined(username) ||
		isNullOrUndefined(totalCompletedGames)
	) {
		return null;
	}

	const totalPages = getTotalPages(totalCompletedGames!, gamesPerPage);

	return (
		<>
			<DashboardNavbar />
			<div className="game-history-interface-container">
				<h2 className="game-history-page-header">Game History</h2>
				<div className="game-history-table">
					<div className="game-history-table-header">
						<p className="players-header">Players</p>
						<p className="result-header">Result</p>
					</div>

					<div className="completed-games-container">
						{completedGames.map((gameInfo, index) => {
							return (
								<CompletedGameInfo
									key={index}
									username={username!}
									gameInfo={gameInfo}
								/>
							);
						})}
					</div>
				</div>

				<PageNavigation
					totalPages={totalPages}
					currentPage={currentPage}
					setPage={setCurrentPage}
				/>
			</div>
		</>
	);
}

export default GameHistory;
