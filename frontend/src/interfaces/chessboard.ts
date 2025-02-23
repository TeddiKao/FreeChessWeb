import React from "react";
import {
    ChessboardSquareIndex,
    OptionalValue,
    StateSetterFunction,
} from "../types/general.ts";
import { PieceColor, PieceType } from "../types/gameLogic.ts";

interface DisplayChessboardProps {
    parsed_fen_string: any;
    orientation: string;
}

interface ChessboardProps extends DisplayChessboardProps {
    setBoardOrientation: StateSetterFunction<string>;
    flipOnMove: boolean;
    gameplaySettings: any;
}

interface MultiplayerChessboardProps extends DisplayChessboardProps {
    gameId: number | string;
    setWhiteTimer: StateSetterFunction<OptionalValue<number>>;
    setBlackTimer: StateSetterFunction<OptionalValue<number>>;
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
    ) => (Promise<void> | void) ;
    previousDraggedSquare: OptionalValue<ChessboardSquareIndex>;
    previousDroppedSquare: OptionalValue<ChessboardSquareIndex>;
    moveMethod: OptionalValue<string>;
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
    SquareProps,
};
