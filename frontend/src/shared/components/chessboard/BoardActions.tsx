import "../../styles/chessboard/board-actions.scss";

interface BoardActionsProps {
    displaySettings: () => void;
    toggleBoardOrientation: () => void;
}

function BoardActions({ toggleBoardOrientation, displaySettings }: BoardActionsProps) {
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
				onClick={displaySettings}
			/>
		</div>
	);
}

export default BoardActions;
