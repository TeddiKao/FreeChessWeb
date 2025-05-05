import "../../../styles/features/gameHistory/completed-game-info.scss";

type CompletedGameInfoProps = {
	gameInfo: any;
	username: string;
};

function CompletedGameInfo({ gameInfo }: CompletedGameInfoProps) {
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
                <p className="result-text">{gameInfo.game_winner}</p>
            </div>
		</div>
	);
}

export default CompletedGameInfo;
