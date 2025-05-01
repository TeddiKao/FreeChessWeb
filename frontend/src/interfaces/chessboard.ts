import React from "react";
import {
	ChessboardSquareIndex,
	OptionalValue,
	StateSetterFunction,
} from "../types/general.ts";
import { ParsedFENString, PieceColor, PieceType } from "../types/gameLogic.ts";

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
		}>
	>;
	lastDraggedSquare: ChessboardSquareIndex;
	lastDroppedSquare: ChessboardSquareIndex;

	setGameEnded: StateSetterFunction<boolean>;
	setGameEndedCause: StateSetterFunction<string>;
	setGameWinner: StateSetterFunction<string>;
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
		}>
	>;
	setMoveList: StateSetterFunction<Array<Array<string>>>;

	setGameEnded: StateSetterFunction<boolean>;
	setGameEndedCause: StateSetterFunction<string>;
	setGameWinner: StateSetterFunction<string>;

	lastDraggedSquare: string;
	lastDroppedSquare: string;
	gameplaySettings: any;
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
	SquareProps,
};
