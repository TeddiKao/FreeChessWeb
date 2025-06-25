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
	[key: string]: {
		[key: string]: boolean;
	};
}

interface SquareInfo {
	piece_color: PieceColor;
	piece_type: string;
	starting_square?: string;
}

interface PromotedPiecesList {
	queens: number;
	rooks: number;
	bishops: number;
	knights: number;
}

interface CapturedPiecesList extends PromotedPiecesList {
	pawns: number;
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
	captured_material: {
		white: CapturedPiecesList;
		black: CapturedPiecesList;
	};
	promoted_pieces: {
		white: PromotedPiecesList;
		black: PromotedPiecesList;
	};
}

type PositionList = PositionInfo[];
type MoveList = string[][]

export type {
	ParsedFEN,
	BoardPlacement,
	CastlingRights,
	SquareInfo,
	PositionList,
    MoveList,
    MoveInfo,
    CapturedPiecesList,
    PromotedPiecesList
};
