// Basic imports like CSS files and components
import ChessboardGrid from "../../../../shared/components/chessboard/ChessboardGrid";
import Square from "../../../../shared/components/chessboard/Square";

// Types, interfaces, enums
import {
	FilledSquareRenderParams,
	EmptySquareRenderParams,
} from "../../../../interfaces/chessboardGrid";
import { PieceColor, PieceType } from "../../../../shared/types/pieces.types";
import { MultiplayerChessboardProps } from "../types/chessboardProps.types";

// Utils
import { isNullOrUndefined } from "../../../../utils/generalUtils";

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
		setDroppedSquare,
	},

	cancelPromotion,
	onPromotion,
	shouldShowPromotionPopup,
	promotionSquare,

	animationRef,
	animationSquare,
}: MultiplayerChessboardProps) {
	const chessboardStyles = {
		gridTemplateColums: `repeat(8, ${squareSize}px)`,
	};

	function renderFilledSquare({
		squareIndex,
		squareColor,
		promotionRank,
		pieceRank,
		pieceColor,
		pieceType,
	}: FilledSquareRenderParams) {
		const isPromotionSquareDefined = !isNullOrUndefined(promotionSquare);
		const isPromotionSquare =
			Number(squareIndex) === Number(promotionSquare);
		const shouldDisplayPromotionPopup =
			isPromotionSquareDefined &&
			isPromotionSquare &&
			shouldShowPromotionPopup;

		return (
			<Square
				key={squareIndex}
				squareNumber={squareIndex}
				squareColor={squareColor}
				pieceColor={pieceColor as PieceColor}
				pieceType={pieceType as PieceType}
				displayPromotionPopup={shouldDisplayPromotionPopup}
				setDraggedSquare={setDraggedSquare}
				setDroppedSquare={setDroppedSquare}
				handlePromotionCancel={cancelPromotion}
				handlePawnPromotion={onPromotion}
				previousDraggedSquare={previousDraggedSquare}
				previousDroppedSquare={previousDroppedSquare}
				orientation={orientation}
				squareSize={squareSize}
				clickedSquare={clickedSquare}
				prevClickedSquare={prevClickedSquare}
				setClickedSquare={setClickedSquare}
				setPrevClickedSquare={setPrevClickedSquare}
				animationRef={animationRef}
				animatingPieceSquare={animationSquare}
			/>
		);
	}

	function renderEmptySquare({
		squareIndex,
		squareColor,
	}: EmptySquareRenderParams) {
		const isPromotionSquareDefined = !isNullOrUndefined(promotionSquare);
		const isPromotionSquare =
			Number(squareIndex) === Number(promotionSquare);
		const shouldDisplayPromotionPopup =
			isPromotionSquareDefined &&
			isPromotionSquare &&
			shouldShowPromotionPopup;

		return (
			<Square
				key={squareIndex}
				squareNumber={squareIndex}
				squareColor={squareColor}
				displayPromotionPopup={shouldDisplayPromotionPopup}
				setDraggedSquare={setDraggedSquare}
				setDroppedSquare={setDroppedSquare}
				handlePromotionCancel={cancelPromotion}
				handlePawnPromotion={onPromotion}
				previousDraggedSquare={previousDraggedSquare}
				previousDroppedSquare={previousDroppedSquare}
				orientation={orientation}
				squareSize={squareSize}
				setClickedSquare={setClickedSquare}
				setPrevClickedSquare={setPrevClickedSquare}
				clickedSquare={clickedSquare}
				prevClickedSquare={prevClickedSquare}
				animationRef={animationRef}
				animatingPieceSquare={animationSquare}
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
