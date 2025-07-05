import { OptionalValue, RefObject, StateSetterFunction } from "./utility.types";
import { ChessboardSquareIndex } from "./board.types";
import { PieceColor, PieceType } from "./pieces.types";

interface EmptySquareProps {
	squareNumber: ChessboardSquareIndex;
	squareColor: string;
	orientation: string;
	displayPromotionPopup: boolean;

	prevClickedSquare: OptionalValue<ChessboardSquareIndex>;
	clickedSquare: OptionalValue<ChessboardSquareIndex>;

	setDraggedSquare: StateSetterFunction<OptionalValue<ChessboardSquareIndex>>;
	setDroppedSquare: StateSetterFunction<OptionalValue<ChessboardSquareIndex>>;
	setPrevClickedSquare: StateSetterFunction<
		OptionalValue<ChessboardSquareIndex>
	>;
	setClickedSquare: StateSetterFunction<OptionalValue<ChessboardSquareIndex>>;

	handlePromotionCancel: (color: PieceColor) => void;
	handlePawnPromotion: (
		color: PieceColor,
		promotedPiece: PieceType
	) => Promise<void> | void;
	previousDraggedSquare: OptionalValue<ChessboardSquareIndex>;
	previousDroppedSquare: OptionalValue<ChessboardSquareIndex>;

	squareSize?: number;
	animatingPieceStyle?: Record<string, unknown>;
	animatingPieceSquare: OptionalValue<ChessboardSquareIndex>;
	animationRef: RefObject<HTMLDivElement | null>;
}

interface FilledSquareProps extends EmptySquareProps {
	pieceColor?: PieceColor;
	pieceType?: PieceType;
}

export type { EmptySquareProps, FilledSquareProps };
