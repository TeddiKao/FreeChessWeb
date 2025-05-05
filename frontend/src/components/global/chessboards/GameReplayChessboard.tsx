import { GameReplayChessboardProps } from "../../../interfaces/chessboard";
import {
	getBoardEndingIndex,
	getBoardStartingIndex,
	getSquareClass,
	isSquareLight,
} from "../../../utils/boardUtils";
import { capitaliseFirstLetter } from "../../../utils/generalUtils";

function GameReplayChessboard({
	parsed_fen_string,
	lastDraggedSquare,
	lastDroppedSquare,
	orientation,
}: GameReplayChessboardProps) {
	if (!parsed_fen_string) {
		return null;
	}

	function generateChessboard() {
		const squareElements = [];

		const startingRow = orientation.toLowerCase() === "white" ? 8 : 1;
		const endingRow = orientation.toLowerCase() === "white" ? 1 : 8;

		for (
			let row = startingRow;
			orientation.toLowerCase() === "white"
				? row >= endingRow
				: row <= endingRow;
			orientation.toLowerCase() === "white" ? row-- : row++
		) {
			const startingIndex = getBoardStartingIndex(row, orientation);
			const endingIndex = getBoardEndingIndex(row, orientation);

			for (
				let square = startingIndex;
				orientation.toLowerCase() === "white"
					? square <= endingIndex
					: square >= endingIndex;
				orientation.toLowerCase() === "white" ? square++ : square--
			) {
				const boardPlacement = parsed_fen_string["board_placement"];
				const squaresArray = Object.keys(boardPlacement);

				const boardPlacementSquare = square - 1;
				const squareColor = isSquareLight(boardPlacementSquare)
					? "light"
					: "dark";

				if (squaresArray.includes(`${boardPlacementSquare}`)) {
					const pieceType =
						boardPlacement[`${boardPlacementSquare}`]["piece_type"];
					const pieceColor =
						boardPlacement[`${boardPlacementSquare}`][
							"piece_color"
						].toLowerCase();

					squareElements.push(
						<div
							key={`${boardPlacementSquare}`}
							id={`${boardPlacementSquare}`}
							className={getSquareClass(
								`${boardPlacementSquare}`,
								lastDraggedSquare,
								lastDroppedSquare
							)}
						>
							<img
								src={`/${pieceColor.toLowerCase()}${capitaliseFirstLetter(
									pieceType
								)}.svg`}
								className="piece-image"
							/>
						</div>
					);
				} else {
					squareElements.push(
						<div
							key={`${boardPlacementSquare}`}
							id={`${boardPlacementSquare}`}
							className={getSquareClass(
								`${boardPlacementSquare}`,
								lastDraggedSquare,
								lastDroppedSquare
							)}
						></div>
					);
				}
			}
		}

		return squareElements;
	}

	return <div className="chessboard-container">{generateChessboard()}</div>;
}

export default GameReplayChessboard;
