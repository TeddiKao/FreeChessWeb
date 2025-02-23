import { ChessboardSquareIndex } from "./general";

type SquareInfo = {
    piece_color: string;
    piece_type: string;
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
};

type PieceInfo = {
    piece_color: string;
    piece_type: string;
};

type PieceColor = "white" | "black";
type CastlingSide = "queenside" | "kingside"

export type {
    ParsedFENString,
    PieceInfo,
    BoardPlacement,
    CastlingRights,
    PieceColor,
	CastlingSide
};
