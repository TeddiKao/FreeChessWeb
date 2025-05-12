import React from "react";
import {
	ChessboardSquareIndex,
	OptionalValue,
	StateSetterFunction,
} from "../types/general.ts";
import { MoveInfo, ParsedFENString, PieceColor, PieceType } from "../types/gameLogic.ts";

interface DisplayChessboardProps {
	parsed_fen_string: ParsedFENString;
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
			position: ParsedFENString;
			move_type: string;
			last_dragged_square: ChessboardSquareIndex;
			last_dropped_square: ChessboardSquareIndex;
			move_info: MoveInfo
		}>
	>;
	lastDraggedSquare: ChessboardSquareIndex;
	lastDroppedSquare: ChessboardSquareIndex;

	setGameEnded: StateSetterFunction<boolean>;
	setGameEndedCause: StateSetterFunction<string>;
	setGameWinner: StateSetterFunction<string>;

	parentAnimationSquare: OptionalValue<ChessboardSquareIndex>
	parentAnimationStyles: Record<string, unknown>
}

interface MultiplayerChessboardProps extends DisplayChessboardProps {
	gameId: number | string;
	setWhiteTimer: StateSetterFunction<OptionalValue<number>>;
	setBlackTimer: StateSetterFunction<OptionalValue<number>>;
	setPositionIndex: StateSetterFunction<number>;
	setPositionList: StateSetterFunction<
		Array<{
			position: ParsedFENString;
			last_dragged_square: string;
			last_dropped_square: string;
			move_type: string;
			move_info: MoveInfo
		}>
	>;
	setMoveList: StateSetterFunction<Array<Array<string>>>;

	setGameEnded: StateSetterFunction<boolean>;
	setGameEndedCause: StateSetterFunction<string>;
	setGameWinner: StateSetterFunction<string>;

	lastDraggedSquare: string;
	lastDroppedSquare: string;
	gameplaySettings: any;

	parentAnimationSquare: OptionalValue<ChessboardSquareIndex>
	parentAnimationStyles: Record<string, unknown>
}

interface GameReplayChessboardProps extends DisplayChessboardProps {
	lastDraggedSquare: string;
	lastDroppedSquare: string;

	animationSquare: OptionalValue<ChessboardSquareIndex>;
	animationStyles: Record<string, unknown>
}

interface EmptySquareProps {
	squareNumber: string | number;
	squareColor: string;
	orientation: string;
	handleSquareClick: (
		event: React.MouseEvent<HTMLElement>,
		square: ChessboardSquareIndex
	) => void;
	displayPromotionPopup: boolean;
	setParsedFENString: StateSetterFunction<any>;
	setDraggedSquare: StateSetterFunction<OptionalValue<ChessboardSquareIndex>>;
	setDroppedSquare: StateSetterFunction<OptionalValue<ChessboardSquareIndex>>;
	handlePromotionCancel: (color: PieceColor) => void;
	handlePawnPromotion: (
		color: PieceColor,
		promotedPiece: PieceType,
		moveMethod: string,
		autoQueen?: boolean
	) => Promise<void> | void;
	previousDraggedSquare: OptionalValue<ChessboardSquareIndex>;
	previousDroppedSquare: OptionalValue<ChessboardSquareIndex>;
	moveMethod: OptionalValue<string>;
	squareSize?: number;
	animatingPieceStyle: Record<string, unknown>;
	animatingPieceSquare: OptionalValue<ChessboardSquareIndex>;
}

interface FilledSquareProps {
	pieceColor?: PieceColor;
	pieceType?: PieceType;
}

interface SquareProps extends EmptySquareProps, FilledSquareProps {}

export type {
	DisplayChessboardProps,
	ChessboardProps,
	MultiplayerChessboardProps,
	BotChessboardProps,
	GameReplayChessboardProps,
	SquareProps,
};
