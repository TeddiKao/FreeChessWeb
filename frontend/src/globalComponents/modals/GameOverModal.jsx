import "../../styles/modals/game-over-modal.css"

function GameOverModal({ visible, gameEndCause, gameWinner }) {
	if (!visible) {
		return null;
	}

	return (
		<div className="game-over-modal">
			<p>Game over</p>
		</div>
	)
}

export default GameOverModal;