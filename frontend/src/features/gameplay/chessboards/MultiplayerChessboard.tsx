import _ from "lodash";

// Basic imports like CSS files and components
import "../../../styles/components/chessboard/chessboard.scss";
import Square from "../../../components/chessboard/Square.tsx";

// Types, interfaces, enums
import { MultiplayerChessboardProps } from "../../../interfaces/chessboard.js";
import { PieceColor, PieceType } from "../../../types/gameLogic.ts";

// Utils
import { isObjEmpty } from "../../../utils/generalUtils.ts";
import ChessboardGrid from "../../../components/chessboard/ChessboardGrid.tsx";
import {
	EmptySquareRenderParams,
	FilledSquareRenderParams,
} from "../../../interfaces/chessboardGrid.ts";

function MultiplayerChessboard({
	parsed_fen_string,
	orientation,

	squareSize,

	setPrevClickedSquare,
	setClickedSquare,
	setDraggedSquare,
	setDroppedSquare,

	previousDraggedSquare,
	previousDroppedSquare,
	prevClickedSquare,
	clickedSquare,

	parentAnimationSquare,
	parentAnimationStyles,
}: MultiplayerChessboardProps) {
	const chessboardStyles = {
		gridTemplateColumns: `repeat(8, ${squareSize}px)`,
	};

	function renderFilledSquare({
		squareIndex,
		squareColor,
		promotionRank,
		pieceRank,
		pieceColor,
		pieceType,
	}: FilledSquareRenderParams) {
		return (
			<Square
				key={squareIndex}
				squareNumber={squareIndex}
				squareColor={squareColor}
				pieceColor={pieceColor as PieceColor}
				pieceType={pieceType as PieceType}
				displayPromotionPopup={
					pieceType.toLowerCase() === "pawn" &&
					promotionRank === pieceRank
				}
				setDraggedSquare={setDraggedSquare}
				setDroppedSquare={setDroppedSquare}
				setPrevClickedSquare={setPrevClickedSquare}
				setClickedSquare={setClickedSquare}
				handlePromotionCancel={handlePromotionCancel}
				handlePawnPromotion={handlePawnPromotion}
				previousDraggedSquare={previousDraggedSquare}
				previousDroppedSquare={previousDroppedSquare}
				orientation={orientation}
				moveMethod={lastUsedMoveMethod}
				squareSize={squareSize}
				// @ts-ignore
				animatingPieceSquare={
					// @ts-ignore
					parentAnimationSquare
				}
				// @ts-ignore
				animatingPieceStyle={
					// @ts-ignore
					parentAnimationStyles
				}
				prevClickedSquare={prevClickedSquare}
				clickedSquare={clickedSquare}
			/>
		);
	}

	function renderEmptySquare({
		squareIndex,
		squareColor,
	}: EmptySquareRenderParams) {
		return (
			<Square
				key={squareIndex}
				squareNumber={squareIndex}
				squareColor={squareColor}
				setPrevClickedSquare={setPrevClickedSquare}
				setClickedSquare={setClickedSquare}
				displayPromotionPopup={false}
				setDraggedSquare={setDraggedSquare}
				setDroppedSquare={setDroppedSquare}
				handlePromotionCancel={handlePromotionCancel}
				handlePawnPromotion={handlePawnPromotion}
				previousDraggedSquare={previousDraggedSquare}
				previousDroppedSquare={previousDroppedSquare}
				orientation={orientation}
				moveMethod={lastUsedMoveMethod}
				squareSize={squareSize}
				// @ts-ignore
				animatingPieceSquare={parentAnimationSquare}
				// @ts-ignore
				animatingPieceStyle={
					// @ts-ignore
					parentAnimationStyles
				}
				prevClickedSquare={prevClickedSquare}
				clickedSquare={clickedSquare}
			/>
		);
	}

	return (
		<>
			<ChessboardGrid
				boardOrientation={orientation}
				boardPlacement={parsed_fen_string["board_placement"]}
				renderEmptySquare={renderEmptySquare}
				renderFilledSquare={renderFilledSquare}
				chessboardStyles={chessboardStyles}
			/>
		</>
	);
}

export default MultiplayerChessboard;
