import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";
import { BaseChessboardProps } from "@sharedTypes/chessTypes/chessboardProps.types";
import { ParsedFEN, MoveInfo } from "@sharedTypes/chessTypes/gameState.types";
import { StateSetterFunction, OptionalValue, RefObject } from "@sharedTypes/utility.types";
import { CheckmateEventData } from "../../multiplayer/types/gameEvents.types";
import { PieceColor, PieceType } from "@/shared/types/chessTypes/pieces.types";

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

interface BotChessboardProps extends BaseChessboardProps {
	gameplaySettings: any;
	gameId: number;
	botId: string;
	setMoveList: StateSetterFunction<Array<Array<string>>>;
	setPositionList: StateSetterFunction<
		Array<{
			position: ParsedFEN;
			move_type: string;
			last_dragged_square: ChessboardSquareIndex;
			last_dropped_square: ChessboardSquareIndex;
			move_info: MoveInfo;
		}>
	>;
	previousDraggedSquare: ChessboardSquareIndex;
	previousDroppedSquare: ChessboardSquareIndex;
	clickedSquaresState: ClickedSquaresState;
	dragAndDropSquaresState: DragAndDropSquaresState;
    setPositionIndex: StateSetterFunction<number>;

	setGameEnded: StateSetterFunction<boolean>;
	setGameEndedCause: StateSetterFunction<string>;
	setGameWinner: StateSetterFunction<string>;

	parentAnimationSquare: OptionalValue<ChessboardSquareIndex>;
	parentAnimationStyles: Record<string, unknown>;

	handleCheckmate: (eventData: CheckmateEventData) => void;
	handleDraw: (drawCause: string) => void;

	cancelPromotion: () => void;
	handlePawnPromotion: (color: PieceColor, promotedPiece: PieceType) => void;
	promotionSquare: ChessboardSquareIndex | null;
	shouldShowPromotionPopup: boolean;

	animationRef: RefObject<HTMLDivElement | null>;
	animationSquare: OptionalValue<ChessboardSquareIndex>;
}

export type { BotChessboardProps }