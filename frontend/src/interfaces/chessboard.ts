import { ChessboardSquareIndex } from "../shared/types/chessTypes/board.types";
import { ParsedFEN, MoveInfo } from "../shared/types/chessTypes/gameState.types";
import { OptionalValue, StateSetterFunction } from "../shared/types/utility.types";

interface DisplayChessboardProps {
	parsed_fen_string: ParsedFEN;
	orientation: string;
	squareSize?: number;
}

interface ChessboardProps extends DisplayChessboardProps {
	setBoardOrientation: StateSetterFunction<string>;
	flipOnMove: boolean;
	gameplaySettings: any;
}

interface BotChessboardProps extends DisplayChessboardProps {
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

interface GameReplayChessboardProps extends DisplayChessboardProps {
	lastDraggedSquare: string;
	lastDroppedSquare: string;

	animationSquare: OptionalValue<ChessboardSquareIndex>;
	animationStyles: Record<string, unknown>;
}

export type {
	DisplayChessboardProps,
	ChessboardProps,
	BotChessboardProps,
	GameReplayChessboardProps,
};
