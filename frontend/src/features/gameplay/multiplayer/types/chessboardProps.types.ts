import { ChessboardSquareIndex } from "../../../../shared/types/chessTypes/board.types";
import { BaseChessboardProps } from "../../../../shared/types/chessTypes/chessboardProps.types";
import { PieceColor, PieceType } from "../../../../shared/types/chessTypes/pieces.types";
import {
	OptionalValue,
	RefObject,
	StateSetterFunction,
} from "../../../../shared/types/utility.types";

interface ClickedSquaresState {
	prevClickedSquare: OptionalValue<ChessboardSquareIndex>;
	clickedSquare: OptionalValue<ChessboardSquareIndex>;
	setPrevClickedSquare: StateSetterFunction<ChessboardSquareIndex | null>;
	setClickedSquare: StateSetterFunction<ChessboardSquareIndex | null>;
}

interface DragAndDropSquaresState {
	draggedSquare: OptionalValue<ChessboardSquareIndex>;
	droppedSquare: OptionalValue<ChessboardSquareIndex>;
	setDraggedSquare: StateSetterFunction<ChessboardSquareIndex | null>;
	setDroppedSquare: StateSetterFunction<ChessboardSquareIndex | null>;
}

interface MultiplayerChessboardProps extends BaseChessboardProps {
	clickedSquaresState: ClickedSquaresState;
	dragAndDropSquaresState: DragAndDropSquaresState;

	previousDraggedSquare: ChessboardSquareIndex;
	previousDroppedSquare: ChessboardSquareIndex;

	cancelPromotion: () => void;
	onPromotion: (color: PieceColor, promotedPiece: PieceType) => void;
	shouldShowPromotionPopup: boolean;
	promotionSquare: OptionalValue<ChessboardSquareIndex>;

	animationSquare: OptionalValue<ChessboardSquareIndex>;
	animationRef: RefObject<HTMLDivElement | null>;
}

export type { MultiplayerChessboardProps };
