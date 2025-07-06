function BoardActions() {
	return (
		<div className="board-actions">
			<img
				onClick={toggleBoardOrientation}
				className="flip-board-icon"
				src="/icons/gameplay/boardActions/flip-board-icon.png"
			/>
			<img
				className="settings-icon"
				src="/icons/gameplay/boardActions/settings.svg"
				onClick={handleSettingsDisplay}
			/>
		</div>
	);
}

export default BoardActions;
