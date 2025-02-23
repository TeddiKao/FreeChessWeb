import { ChessboardSquareIndex, StateSetterFunction } from "../types/general.ts";

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
    setWhiteTimer: StateSetterFunction<number>;
    setBlackTimer: StateSetterFunction<number>;
}

interface EmptySquareProps {
    squareNumber: string | number;
    squareColor: string;
    orientation: string;
    handleSquareClick: (event: MouseEvent, square: ChessboardSquareIndex) => void;
    displayPromotionPopup: boolean;
    setParsedFENString: StateSetterFunction<any>;
    setDraggedSquare: StateSetterFunction<string | number | null>;
    setDroppedSquare: StateSetterFunction<string | number | null>;
    handlePromotionCancel: (color: string) => void;
    handlePawnPromotion: (color: string, promotedPiece: string) => Promise<void>;
    previousDraggedSquare: string | number | null;
    previousDroppedSquare: string | number | null;
}

interface FilledSquareProps {
    pieceColor?: string;
    pieceType?: string;
}

interface SquareProps extends EmptySquareProps, FilledSquareProps {}

export type {
    DisplayChessboardProps,
    ChessboardProps,
    MultiplayerChessboardProps,
    SquareProps
};
