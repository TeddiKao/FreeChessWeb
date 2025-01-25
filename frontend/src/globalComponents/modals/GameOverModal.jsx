import "../../styles/modals/game-over-modal.css"
import { capitaliseFirstLetter } from "../../utils/generalUtils";

function GameOverModal({ visible, gameEndCause, gameWinner }) {
	if (!visible) {
		return null;
	}

	const gameResultText = !gameWinner ? "Draw" : `${capitaliseFirstLetter(gameWinner)} won`
	const gameEndCauseText = capitaliseFirstLetter(gameEndCause)

	return (
		<div className="game-over-modal-container">
			<h1 className="game-result">{gameResultText}</h1>
			<p className="game-end-cause">by {gameEndCauseText}</p>
		</div>
	)
}

export default GameOverModal;