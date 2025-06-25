import { PieceColor } from "../../../../types/gameLogic";

interface ParsedFEN {
    board_placement: BoardPlacement
    castling_rights: CastlingRights
    en_passant_target_square: number | null
    halfmove_clock: number
    fullmove_number: number;
    side_to_move?: string
}

interface BoardPlacement {
    [key: string]: SquareInfo
}

interface CastlingRights {
    [key: string]: {
        [key: string]: boolean;
    }
}

interface SquareInfo {
    piece_color: PieceColor,
    piece_type: string,
    starting_square?: string
}

export type { ParsedFEN, BoardPlacement, CastlingRights, SquareInfo };