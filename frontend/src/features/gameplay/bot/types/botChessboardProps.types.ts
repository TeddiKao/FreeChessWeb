import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";
import { BaseChessboardProps } from "@sharedTypes/chessTypes/chessboardProps.types";
import { ParsedFEN, MoveInfo } from "@sharedTypes/chessTypes/gameState.types";
import { StateSetterFunction, OptionalValue } from "@sharedTypes/utility.types";
import { CheckmateEventData } from "../../multiplayer/types/gameEvents.types";

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
	lastDraggedSquare: ChessboardSquareIndex;
	lastDroppedSquare: ChessboardSquareIndex;
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
	handlePawnPromotion: () => void;
	promotionSquare: ChessboardSquareIndex;
}

export type { BotChessboardProps }