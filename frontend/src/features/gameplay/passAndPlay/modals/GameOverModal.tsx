import { capitaliseFirstLetter } from "@sharedUtils/generalUtils";
import "../../common/styles/game-over-modal.scss";

type LocalGameOverModalProps = {
	visible: boolean;
	gameWinner: string;
	gameEndCause: string;

	newGameAction?: () => void;
};

function LocalGameOverModal({
	newGameAction,
	gameWinner,
	visible,
	gameEndCause,
}: LocalGameOverModalProps) {
	if (!visible) {
		return null;
	}

	const gameResultText = !gameWinner
		? "Draw"
		: `${capitaliseFirstLetter(gameWinner)} won`;
	const gameEndCauseText = capitaliseFirstLetter(gameEndCause);

	return (
		<div className="game-over-modal-container">
			<h1 className="game-result">{gameResultText}</h1>
			<p className="game-end-cause">by {gameEndCauseText}</p>
			<div className="buttons-container">
				<button
					onClick={newGameAction || undefined}
					className="new-game-button"
				>
					New game
				</button>
				<button className="rematch-button">Rematch</button>
			</div>
		</div>
	);
}

export default LocalGameOverModal;
