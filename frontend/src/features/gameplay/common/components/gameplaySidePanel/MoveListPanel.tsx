import "../../styles/gameplaySidePanel/move-list-panel.scss";
import { StateSetterFunction } from "../../../../../shared/types/utility.types";

type MoveListPanelProps = {
	moveList: Array<Array<string>>;
	setPositionIndex: StateSetterFunction<number>;
	gameWinner: string | null;
	gameEnded: boolean;
};

function MoveListPanel({
	moveList,
	setPositionIndex,
	gameWinner,
	gameEnded,
}: MoveListPanelProps) {
	function navigateToMove(movePairIndex: number, moveIndex: number) {
		const positionIndex = movePairIndex * 2 + (moveIndex + 1);
		setPositionIndex(positionIndex);
	}

	function generateMovePairMoves(
		movePair: Array<string>,
		movePairIndex: number
	) {
		return movePair.map((notatedMove: string, moveIndex) => {
			return (
				<p
					onClick={() => {
						navigateToMove(movePairIndex, moveIndex);
					}}
					key={moveIndex}
					className="notated-move"
				>
					{notatedMove}
				</p>
			);
		});
	}

	function generateGameResult() {
		if (!gameWinner) {
			return "1/2 - 1/2";
		} else if (gameWinner.toLowerCase() === "white") {
			return "1-0";
		} else if (gameWinner.toLowerCase() === "black") {
			return "0-1";
		}
	}

	return (
		<div className="move-list-panel-container">
			<h4 className="move-list-header">Moves</h4>
			<div className="moves-container">
				{moveList.map(
					(movePair: Array<string>, movePairIndex: number) => {
						return (
							<div className="move-info-container">
								<p className="move-number">
									{movePairIndex + 1}.
								</p>
								<div
									key={movePairIndex}
									className="move-pair-container"
								>
									{generateMovePairMoves(
										movePair,
										movePairIndex
									)}
								</div>
							</div>
						);
					}
				)}
				{gameEnded && (
					<p className="game-result-code">{generateGameResult()}</p>
				)}
			</div>
		</div>
	);
}

export default MoveListPanel;
