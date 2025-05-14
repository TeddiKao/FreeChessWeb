import { BoardPlacement } from "../../../types/gameLogic";

import "../../../styles/components/chessboard/chessboard.scss";
import { getFile, getRank } from "../../../utils/boardUtils";

type ChessboardGridProps = {
	filledSquareComponent: JSX.Element;
	emptySquareComponent: JSX.Element;
	boardOrientation: "White" | "Black";
	boardPlacement: BoardPlacement;

    renderFilledSquare: (params: {
        sqaureIndex: number,
        pieceType: string,
        pieceColor: string,
        row: number,
        column: number
    }) => JSX.Element

    renderEmptySquare: (params: {
        sqaureIndex: number,
        row: number,
        column: number
    }) => JSX.Element
};

function ChessboardGrid({
	filledSquareComponent,
	emptySquareComponent,
	boardOrientation,
	boardPlacement,

	renderFilledSquare,
	renderEmptySquare
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
				const column = getFile(boardPlacementSquare);

				if (
					Object.keys(boardPlacement).includes(boardPlacementSquare)
				) {
					squareElements.push(
						renderFilledSquare({
							sqaureIndex: square - 1,
							pieceType: boardPlacement[boardPlacementSquare]["piece_type"],
							pieceColor: boardPlacement[boardPlacementSquare]["piece_color"],
							row: row,
							column: column,
						})
					);
				} else {
					squareElements.push(
						renderEmptySquare({
							sqaureIndex: square - 1,
							row: row,
							column: column
						})
					);
				}
			}
		}

		return squareElements;
	}

	return <div className="chessboard-container">{generateChessboard()}</div>;
}

export default ChessboardGrid;
