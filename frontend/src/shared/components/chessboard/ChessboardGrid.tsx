import "../../styles/chessboard/chessboard.scss";
import { getFile, getRank, isSquareLight } from "../../utils/boardUtils";
import {
	EmptySquareRenderParams,
	FilledSquareRenderParams,
} from "../../../interfaces/chessboardGrid";
import { getPromotionRank } from "../../../features/gameplay/passAndPlay/utils/promotion";
import { BoardPlacement } from "../../types/gameState.types";

type ChessboardGridProps = {
	boardOrientation: string;
	boardPlacement: BoardPlacement;
	chessboardStyles?: { [key: string]: any };

	renderFilledSquare: (params: FilledSquareRenderParams) => JSX.Element;

	renderEmptySquare: (params: EmptySquareRenderParams) => JSX.Element;
};

function ChessboardGrid({
	boardOrientation,
	boardPlacement,
	chessboardStyles,

	renderFilledSquare,
	renderEmptySquare,
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

				const squareLight = isSquareLight(boardPlacementSquare);
				const squareColor = squareLight ? "light" : "dark";

				if (
					Object.keys(boardPlacement).includes(boardPlacementSquare)
				) {
					const pieceRank = getRank(boardPlacementSquare);
					const promotionRank = getPromotionRank(
						boardPlacement[boardPlacementSquare]["piece_color"]
					);

					squareElements.push(
						renderFilledSquare({
							squareIndex: square - 1,
							pieceType:
								boardPlacement[boardPlacementSquare][
									"piece_type"
								],
							pieceColor:
								boardPlacement[boardPlacementSquare][
									"piece_color"
								],
							row: row,
							column: column,
							squareColor: squareColor,
							pieceRank: pieceRank,
							promotionRank: promotionRank,
						})
					);
				} else {
					squareElements.push(
						renderEmptySquare({
							squareIndex: square - 1,
							row: row,
							column: column,
							squareColor: squareColor,
						})
					);
				}
			}
		}

		return squareElements;
	}

	return (
		<div style={chessboardStyles} className="chessboard-container">
			{generateChessboard()}
		</div>
	);
}

export default ChessboardGrid;
