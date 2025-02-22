import "../../styles/modals/game-over-modal.css"
import { capitaliseFirstLetter } from "../../utils/generalUtils.ts";

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
			<div className="buttons-container">
				<button className="new-game-button">New game</button>
				<button className="rematch-button">Rematch</button>
			</div>
		</div>
	)
}

export default GameOverModal;