import "@sharedStyles/chessboard/board-actions.scss";

interface BoardActionsProps {
	displaySettings?: () => void;
	toggleBoardOrientation: () => void;

	showSettings?: boolean;
}

function BoardActions({
	toggleBoardOrientation,
	displaySettings,
	showSettings,
}: BoardActionsProps) {
	const shouldShowSettings = showSettings ?? true;

	return (
		<div className="board-actions">
			<img
				onClick={toggleBoardOrientation}
				className="flip-board-icon"
				src="/icons/gameplay/boardActions/flip-board-icon.png"
			/>

			{shouldShowSettings && (
				<img
					className="settings-icon"
					src="/icons/gameplay/boardActions/settings.svg"
					onClick={displaySettings}
				/>
			)}
		</div>
	);
}

export default BoardActions;
