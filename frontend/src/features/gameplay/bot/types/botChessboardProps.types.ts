import { ChessboardSquareIndex } from "../../../../shared/types/chessTypes/board.types";
import { BaseChessboardProps } from "../../../../shared/types/chessTypes/chessboardProps.types";
import { ParsedFEN, MoveInfo } from "../../../../shared/types/chessTypes/gameState.types";
import { StateSetterFunction, OptionalValue } from "../../../../shared/types/utility.types";

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

	setGameEnded: StateSetterFunction<boolean>;
	setGameEndedCause: StateSetterFunction<string>;
	setGameWinner: StateSetterFunction<string>;

	parentAnimationSquare: OptionalValue<ChessboardSquareIndex>;
	parentAnimationStyles: Record<string, unknown>;
}

export type { BotChessboardProps }