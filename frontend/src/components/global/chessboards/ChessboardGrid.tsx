import { BoardPlacement } from "../../../types/gameLogic";

import "../../../styles/components/chessboard/chessboard.scss";

type ChessboardGridProps = {
	filledSquareComponent: JSX.Element;
	emptySquareComponent: JSX.Element;
	boardOrientation: "White" | "Black";
	boardPlacement: BoardPlacement;
};

function ChessboardGrid({
	filledSquareComponent,
	emptySquareComponent,
	boardOrientation,
	boardPlacement,
}: ChessboardGridProps) {
	function generateChessboard() {
		const squareElements = [];

		const startingRow = boardOrientation.toLowerCase() === "white" ? 8 : 1;
		const endingRow = boardOrientation.toLowerCase() === "white" ? 1 : 8;

		for (
			let row = startingRow;
			boardOrientation.toLowerCase() === "white"
				? row >= endingRow
				: row <= endingRow;
			boardOrientation.toLowerCase() === "white" ? row-- : row++
		) {
			const whiteOrientationStartingIndex = (row - 1) * 8 + 1;
			const whiteOrientationEndingIndex = row * 8;

			const blackOrientationStartingIndex = row * 8;
			const blackOrientationEndingIndex = (row - 1) * 8 + 1;

			const startingIndex =
				boardOrientation.toLowerCase() === "white"
					? whiteOrientationStartingIndex
					: blackOrientationStartingIndex;
			const endingIndex =
				boardOrientation.toLowerCase() === "white"
					? whiteOrientationEndingIndex
					: blackOrientationEndingIndex;

			for (
				let square = startingIndex;
				boardOrientation.toLowerCase() === "white"
					? square <= endingIndex
					: square >= endingIndex;
				boardOrientation.toLowerCase() === "white" ? square++ : square--
			) {
				const boardPlacementSquare = `${square - 1}`;
				if (
					Object.keys(boardPlacement).includes(boardPlacementSquare)
				) {
					squareElements.push(filledSquareComponent);
				} else {
					squareElements.push(emptySquareComponent);
				}
			}
		}

		return squareElements;
	}

	return <div className="chessboard-container">{generateChessboard()}</div>;
}

export default ChessboardGrid;
