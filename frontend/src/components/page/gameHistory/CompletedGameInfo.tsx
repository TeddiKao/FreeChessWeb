import "../../../styles/features/gameHistory/completed-game-info.scss";

type CompletedGameInfoProps = {
	gameInfo: any;
	username: string;
};

function CompletedGameInfo({ gameInfo, username }: CompletedGameInfoProps) {
    function getResultIconSrc() {
		if (!gameInfo.game_winner) {
            return "/game-drawn.svg"
        } else if (gameInfo.game_winner === username) {
            return "/game-won.svg"
        } else {
            return "/game-lost.svg"
        }
	}

	return (
		<div className="completed-game-info-container">
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
		</div>
	);
}

export default CompletedGameInfo;
