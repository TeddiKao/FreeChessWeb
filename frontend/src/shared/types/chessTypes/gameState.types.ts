import { ChessboardSquareIndex } from "./board.types";
import { PieceColor, PieceType } from "./pieces.types";

interface ParsedFEN {
	board_placement: BoardPlacement;
	castling_rights: CastlingRights;
	en_passant_target_square: number | null;
	halfmove_clock: number;
	fullmove_number: number;
	side_to_move?: string;
}

interface BoardPlacement {
	[key: string]: SquareInfo;
}

interface CastlingRights {
	White: {
		Kingside: boolean;
		Queenside: boolean;
	},

	Black: {
		Kingside: boolean;
		Queenside: boolean;
	}
}

interface SquareInfo {
	piece_color: PieceColor;
	piece_type: PieceType;
	starting_square?: ChessboardSquareIndex;
}

interface MoveInfo {
	piece_color: PieceColor;
	piece_type: PieceType;
	starting_square: string | number;
	destination_square: string | number;
	initial_square?: string | number;
	additional_info?: {
		promoted_piece?: PieceType;
	};
}

interface PositionInfo {
	position: ParsedFEN;
	last_dragged_square: string;
	last_dropped_square: string;
	move_type: string;
	move_info: MoveInfo;
	captured_material?: {
		white: CapturedPiecesList;
		black: CapturedPiecesList;
	};
	promoted_pieces?: {
		white: PromotedPiecesList;
		black: PromotedPiecesList;
	};
}

interface PromotedPiecesList {
    queens: number
    rooks: number
    bishops: number
    knights: number
}

interface CapturedPiecesList extends PromotedPiecesList {
    pawns: number
}

type PositionList = PositionInfo[];
type MoveList = string[][]

type CastlingSide = "kingside" | "queenside"

export type {
	ParsedFEN,
	BoardPlacement,
	CastlingRights,
	SquareInfo,
	PositionList,
    MoveList,
    MoveInfo,
    CapturedPiecesList,
    PromotedPiecesList,
	CastlingSide,
};
