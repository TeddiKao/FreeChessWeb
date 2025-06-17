import React from "react";
import {
	ChessboardSquareIndex,
	OptionalValue,
	RefObject,
	StateSetterFunction,
} from "../types/general.ts";
import { MoveInfo, ParsedFENString, PieceColor, PieceType } from "../types/gameLogic.ts";
import { CapturedPiecesList, PromotedPiecesList } from "./materialCalculation.ts";

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
	parsedFEN: ParsedFENString | null;
	previousDraggedSquare: ChessboardSquareIndex | null;
	previousDroppedSquare: ChessboardSquareIndex | null;

	setDraggedSquare: StateSetterFunction<ChessboardSquareIndex | null>;
	setDroppedSquare: StateSetterFunction<ChessboardSquareIndex | null>;
	setPrevClickedSquare: StateSetterFunction<ChessboardSquareIndex | null>;
	setClickedSquare: StateSetterFunction<ChessboardSquareIndex | null>;

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
	displayPromotionPopup: boolean;

	prevClickedSquare: OptionalValue<ChessboardSquareIndex>;
	clickedSquare: OptionalValue<ChessboardSquareIndex>;

	setParsedFENString: StateSetterFunction<any>;
	setDraggedSquare: StateSetterFunction<OptionalValue<ChessboardSquareIndex>>;
	setDroppedSquare: StateSetterFunction<OptionalValue<ChessboardSquareIndex>>;
	setPrevClickedSquare: StateSetterFunction<OptionalValue<ChessboardSquareIndex>>;
	setClickedSquare: StateSetterFunction<OptionalValue<ChessboardSquareIndex>>;

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
