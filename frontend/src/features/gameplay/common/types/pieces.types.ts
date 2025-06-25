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

export type {
	PieceColor,
	PieceType,
	CapturablePiece,
	CapturablePiecePlural,
	PromotionPiece,
	PromotionPiecePlural,
};
