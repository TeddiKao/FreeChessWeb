import { useRef, useState } from "react";
import "../../../styles/features/gameHistory/completed-game-info.scss";
import { useNavigate } from "react-router-dom";

type CompletedGameInfoProps = {
	gameInfo: any;
	username: string;
};

function CompletedGameInfo({ gameInfo, username }: CompletedGameInfoProps) {
    const [viewOverlayVisible, setViewOverlayVisible] = useState(false);
    const navigate = useNavigate();

    function getResultIconSrc() {
		if (!gameInfo.game_winner) {
            return "/icons/gameHistory/game-drawn.svg"
        } else if (gameInfo.game_winner === username) {
            return "/icons/gameHistory/game-won.svg"
        } else {
            return "/icons/gameHistory/game-lost.svg"
        }
	}

    function showViewOverlay() {
        setViewOverlayVisible(true);
    }

    function hideViewOverlay() {
        setViewOverlayVisible(false);
    }

    function redirectToViewPage() {
        const gameId = gameInfo.id;

        navigate(`/${gameId}/view`);
    }

	return (
		<div onClick={redirectToViewPage} onMouseEnter={showViewOverlay} onMouseLeave={hideViewOverlay} className="completed-game-info-container">
			<div className="players-container">
				<div className="white-player-container">
                    <div className="white-player-color-icon"></div>
                    <p className="white-player-name">{gameInfo.white_player}</p>
                </div>
				
                <div className="black-player-container">
                    <div className="black-player-color-icon"></div>
                    <p className="black-player-name">{gameInfo.black_player}</p>
                </div>
			</div>

			<div className="result-container">
                <img className="result-icon" src={getResultIconSrc()} alt=""/>
            </div>

            {viewOverlayVisible && (
                <div className="view-game-overlay">
                    <img className="view-game-icon" src="/icons/gameHistory/view-game.svg" />
                    <p className="view-overlay-text">View Game</p>
                </div>
            )}
		</div>
	);
}

export default CompletedGameInfo;
