type PieceColor = "white" | "black";
type PieceType = "pawn" | "rook" | "bishop" | "king" | "knight" | "queen";

type CapturablePiece = "pawn" | "rook" | "bishop" | "knight" | "queen";
type CapturablePiecePlural =
	| "pawns"
	| "rooks"
	| "bishops"
	| "knights"
	| "queens";

type PromotionPiece = "rook" | "bishop" | "knight" | "queen";
type PromotionPiecePlural = "rooks" | "bishops" | "knights" | "queens";

interface PieceInfo {
    piece_color: PieceColor;
    piece_type: PieceType;
	starting_square?: string | number;
}

export type {
	PieceColor,
	PieceType,
	CapturablePiece,
	CapturablePiecePlural,
	PromotionPiece,
	PromotionPiecePlural,
    PieceInfo
};
