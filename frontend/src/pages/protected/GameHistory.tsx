import { useEffect, useState } from "react";
import DashboardNavbar from "../../components/page/dashboard/DashboardNavbar";
import useCompletedGames from "../../hooks/useCompletedGames";

import "../../styles/pages/game-history.scss";
import CompletedGameInfo from "../../components/page/gameHistory/CompletedGameInfo";
import useUsername from "../../hooks/useUsername";
import { isNullOrUndefined } from "../../utils/generalUtils";

function GameHistory() {
    const initialCompletedGames = useCompletedGames();
    const username = useUsername();

    const [completedGames, setCompletedGames] = useState(initialCompletedGames);

    useEffect(() => {
        setCompletedGames(initialCompletedGames);
    }, [initialCompletedGames]);

    if (isNullOrUndefined(username) || isNullOrUndefined(completedGames)) {
        return null;
    }

	return (
		<>
            <DashboardNavbar />
			<div className="game-history-interface-container">
                <h2 className="game-history-header">Game History</h2>
                <div className="completed-games-container">
                    {completedGames.map((gameInfo, index) => {
                        return (
                            <CompletedGameInfo gameInfo={gameInfo} />
                        )
                    })}
                </div>
            </div>
		</>
	);
}

export default GameHistory;
