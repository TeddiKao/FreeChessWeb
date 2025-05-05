import "../../../styles/features/gameHistory/completed-game-info.scss";

type CompletedGameInfoProps = {
	gameInfo: any;
	username: string;
};

function CompletedGameInfo({ gameInfo }: CompletedGameInfoProps) {
	return (
		<div className="completed-game-info-container">
			<div className="players-container">
				<p className="white-player-name">White player: {gameInfo.white_player}</p>
				<p className="black-player-name">Black player: {gameInfo.black_player}</p>
			</div>

			<p>Result: {gameInfo.game_winner}</p>
		</div>
	);
}

export default CompletedGameInfo;
