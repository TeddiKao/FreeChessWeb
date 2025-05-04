import DashboardNavbar from "../../components/page/dashboard/DashboardNavbar";

import "../../styles/pages/game-history.scss";

function GameHistory() {
	return (
		<>
            <DashboardNavbar />
			<div className="game-history-interface-container">
                <h2 className="game-history-header">Game History</h2>
                <div className="completed-games-container">
                    
                </div>
            </div>
		</>
	);
}

export default GameHistory;
