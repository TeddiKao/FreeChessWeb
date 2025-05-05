import { useEffect, useRef, useState } from "react";
import DashboardNavbar from "../../components/page/dashboard/DashboardNavbar";
import useCompletedGames from "../../hooks/useCompletedGames";

import "../../styles/pages/game-history.scss";
import CompletedGameInfo from "../../components/page/gameHistory/CompletedGameInfo";
import useUsername from "../../hooks/useUsername";
import { isNullOrUndefined } from "../../utils/generalUtils";

function GameHistory() {
	const initialCompletedGames = useCompletedGames();
	const initialUsername = useUsername();

	const [completedGames, setCompletedGames] = useState(initialCompletedGames);
	const [username, setUsername] = useState(initialUsername);

	useEffect(() => {
		setCompletedGames(initialCompletedGames);
		console.log(initialCompletedGames);
	}, [initialCompletedGames]);

	useEffect(() => {
		setUsername(initialUsername);
	}, [initialUsername]);

	if (isNullOrUndefined(completedGames) || isNullOrUndefined(username)) {
		return null;
	}

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
			</div>
		</>
	);
}

export default GameHistory;
