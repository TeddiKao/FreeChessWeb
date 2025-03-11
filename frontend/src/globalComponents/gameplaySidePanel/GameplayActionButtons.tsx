import "../../styles/features/gameplay/gameplay-action-buttons.scss";

function GameplayActionButtons() {
	return (
		<div className="gameplay-action-buttons-container">
			<h4 className="gameplay-action-buttons-header">Gameplay actions</h4>
			<div className="gameplay-action-buttons">
				<div className="resignation-icon">
					<img className="resign-icon" src="/resignButton.svg" />
					<p className="helper-text">Resign</p>
				</div>
			</div>
		</div>
	)
}

export default GameplayActionButtons;