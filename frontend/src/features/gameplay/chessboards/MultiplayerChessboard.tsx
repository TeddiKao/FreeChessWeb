import _ from "lodash";

// Basic imports like CSS files and components
import "../../../styles/components/chessboard/chessboard.scss";
import Square from "../../../components/chessboard/Square.tsx";

// Types, interfaces, enums
import { MultiplayerChessboardProps } from "../../../interfaces/chessboard.js";
import {
	PieceColor,
	PieceType,
} from "../../../types/gameLogic.ts";


// Utils
import ChessboardGrid from "../../../components/chessboard/ChessboardGrid.tsx";
import {
	EmptySquareRenderParams,
	FilledSquareRenderParams,
} from "../../../interfaces/chessboardGrid.ts";

function MultiplayerChessboard({
	parsed_fen_string,
	squareSize,
	orientation,

	previousDraggedSquare,
	previousDroppedSquare,

	clickedSquaresState: {
		clickedSquare,
		setClickedSquare,
		prevClickedSquare,
		setPrevClickedSquare,
	},
	dragAndDropSquaresState: {
		draggedSquare,
		droppedSquare,
		setDraggedSquare,
		setDroppedSquare
	},

	animationRef,
	animationSquare,

	cancelPromotion,
	onPromotion,
	shouldShowPromotionPopup,
	promotionSquare
}: MultiplayerChessboardProps) {
	const chessboardStyles = {
		gridTemplateColums: `repeat(8, ${squareSize}px)`
	}

	function renderFilledSquare({
		squareIndex,
		squareColor,
		promotionRank,
		pieceRank,
		pieceColor,
		pieceType,
	}: FilledSquareRenderParams) {
		const isPromotionSquare = Number(squareIndex) === Number(promotionSquare)

		return (
			<Square
				key={squareIndex}
				squareNumber={squareIndex}
				squareColor={squareColor}
				pieceColor={pieceColor as PieceColor}
				pieceType={pieceType as PieceType}
				displayPromotionPopup={shouldShowPromotionPopup && isPromotionSquare}
				setDraggedSquare={setDraggedSquare}
				setDroppedSquare={setDroppedSquare}
				handlePromotionCancel={cancelPromotion}
				handlePawnPromotion={onPromotion}
				previousDraggedSquare={previousDraggedSquare}
				previousDroppedSquare={previousDroppedSquare}
				orientation={orientation}
				squareSize={squareSize}
				// @ts-ignore
				animatingPieceSquare={animationSquare}
				clickedSquare={clickedSquare}
				prevClickedSquare={prevClickedSquare}
				setClickedSquare={setClickedSquare}
				setPrevClickedSquare={setPrevClickedSquare}
				animationRef={animationRef}
			/>
		);
	}

	function renderEmptySquare({
		squareIndex,
		squareColor,
	}: EmptySquareRenderParams) {
		const isPromotionSquare = Number(squareIndex) === Number(promotionSquare)

		return (
			<Square
				key={squareIndex}
				squareNumber={squareIndex}
				squareColor={squareColor}
				displayPromotionPopup={shouldShowPromotionPopup && isPromotionSquare}
				setDraggedSquare={setDraggedSquare}
				setDroppedSquare={setDroppedSquare}
				handlePromotionCancel={cancelPromotion}
				handlePawnPromotion={onPromotion}
				previousDraggedSquare={previousDraggedSquare}
				previousDroppedSquare={previousDroppedSquare}
				orientation={orientation}
				squareSize={squareSize}
				// @ts-ignore
				animatingPieceSquare={animationSquare}
				setClickedSquare={setClickedSquare}
				setPrevClickedSquare={setPrevClickedSquare}
				clickedSquare={clickedSquare}
				prevClickedSquare={prevClickedSquare}
				animationRef={animationRef}
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
