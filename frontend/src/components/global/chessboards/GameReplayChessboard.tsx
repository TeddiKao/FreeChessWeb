import { GameReplayChessboardProps } from "../../../interfaces/chessboard";
import {
	getBoardEndingIndex,
	getBoardStartingIndex,
	getSquareClass,
	isSquareLight,
} from "../../../utils/boardUtils";

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

				const squareColor = isSquareLight(square - 1)
					? "light"
					: "dark";

				if (squaresArray.includes(`${square - 1}`)) {
					const pieceType =
						boardPlacement[`${square - 1}`]["piece_type"];
					const pieceColor =
						boardPlacement[`${square - 1}`][
							"piece_color"
						].toLowerCase();

					squareElements.push(
						<div
							key={square}
							id={`${square}`}
							className={getSquareClass(
								`${square - 1}`,
								lastDraggedSquare,
								lastDroppedSquare
							)}
						>
							<img
								src={`/${pieceColor}${pieceType}.svg`}
								className="piece-image"
							/>
						</div>
					);
				} else {
					squareElements.push(
						<div
							key={square}
							id={`${square}`}
							className={`chessboard-square ${squareColor}`}
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
