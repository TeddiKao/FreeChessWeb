import { ChessboardSquareIndex } from "./general";

type SquareInfo = {
    piece_color: PieceColor;
    piece_type: PieceType;
	starting_square?: ChessboardSquareIndex;
};

type BoardPlacement = {
    [key: string]: SquareInfo;
};

type CastlingRightsInfo = {
    [key: string]: boolean;
};

type CastlingRights = {
    [key: string]: CastlingRightsInfo;
};

type ParsedFENString = {
    board_placement: BoardPlacement;
    castling_rights: CastlingRights;
    en_passant_target_square: number | null;
    halfmove_clock: number;
    fullmove_number: number;
    side_to_move?: string,
};

type PieceInfo = {
    piece_color: PieceColor;
    piece_type: PieceType;
	starting_square?: ChessboardSquareIndex;
};

type PieceColor = "white" | "black";
type PieceType = "pawn" | "rook" | "bishop" | "king" | "knight" | "queen"

type CapturablePiece = "pawn" | "rook" | "bishop" | "knight" | "queen"
type CapturablePiecePlural = "pawns" | "rooks" | "bishops" | "knights" | "queens"

type PromotionPiece = "rook" | "bishop" | "knight" | "queen"
type PromotionPiecePlural = "rooks" | "bishops" | "knights" | "queens"

type CastlingSide = "queenside" | "kingside"

type MoveInfo = {
	piece_color: PieceColor;
	piece_type: PieceType;
	starting_square: ChessboardSquareIndex;
	destination_square: ChessboardSquareIndex;
    initial_square?: ChessboardSquareIndex,
    additional_info?: {
        promoted_piece?: PieceType
    }
}

export type {
    ParsedFENString,
    PieceInfo,
    BoardPlacement,
    CastlingRights,
    PieceColor,
	CastlingSide,
	MoveInfo,
    PieceType,
    SquareInfo,
    CapturablePiece,
    PromotionPiece,
    CapturablePiecePlural
};
