import {
	whiteKingStartingSquare,
	blackKingStartingSquare,
	rookStartingSquares,
} from "../constants/castlingSquares.ts";
import {
	BoardPlacement,
	CastlingRights,
	CastlingSide,
	ParsedFEN,
	SquareInfo,
} from "../../common/types/gameState.types.ts";
import { PieceColor } from "../../common/types/pieces.types.ts";
import { capitaliseFirstLetter } from "../../../../utils/generalUtils.ts";

function getKingStartingSquare(color: string): number {
	color = color.toLowerCase();

	if (color === "white") {
		return whiteKingStartingSquare;
	} else {
		return blackKingStartingSquare;
	}
}

function getKingCastledSquare(
	color: PieceColor,
	castlingSide: CastlingSide
): number {
	castlingSide = castlingSide.toLowerCase() as CastlingSide;

	const startingSquare: number = getKingStartingSquare(color);
	const isCastlingKinsgside: boolean = castlingSide === "kingside";

	// Offset from original king square
	const squareOffset: number = isCastlingKinsgside ? 2 : -2;

	return startingSquare + squareOffset;
}

function getCastledRookSquare(
	color: PieceColor,
	castlingSide: CastlingSide
): number {
	color = color.toLowerCase() as PieceColor;
	castlingSide = castlingSide.toLowerCase() as CastlingSide;

	const rookStartingSquare: number = getRookStartingSquare(
		color,
		castlingSide
	);
	const isCastlingKinsgside: boolean = castlingSide === "kingside";

	// Offset from original rook square
	const squareOffset: number = isCastlingKinsgside ? -2 : 3;

	return rookStartingSquare + squareOffset;
}

function getRookStartingSquare(
	color: PieceColor,
	castlingSide: CastlingSide
): number {
	color = color.toLowerCase() as PieceColor;
	castlingSide = castlingSide.toLowerCase() as CastlingSide;

	return rookStartingSquares[color][castlingSide];
}

function disableCastling(
	color: string,
	castlingRights: CastlingRights,
	castlingSides: Array<CastlingSide>
): CastlingRights {
	const updatedCastlingRights: CastlingRights =
		structuredClone(castlingRights);

	color = color.toLowerCase();

	for (const castlingSide of castlingSides) {
		updatedCastlingRights[
			capitaliseFirstLetter(color) as "White" | "Black"
		][capitaliseFirstLetter(castlingSide) as "Kingside" | "Queenside"] =
			false;
	}

	return updatedCastlingRights;
}

function canCastleKingside(
	color: string,
	castlingRights: CastlingRights
): boolean {
	return castlingRights[capitaliseFirstLetter(color) as "White" | "Black"][
		"Kingside"
	];
}

function canCastleQueenside(
	color: string,
	castlingRights: CastlingRights
): boolean {
	return castlingRights[capitaliseFirstLetter(color) as "White" | "Black"][
		"Queenside"
	];
}

function canCastle(
	color: string,
	castlingSide: string,
	castlingRights: CastlingRights
) {
	color = color.toLowerCase();
	castlingSide = castlingSide.toLowerCase();

	if (castlingSide === "kingside") {
		return canCastleKingside(color, castlingRights);
	} else {
		return canCastleQueenside(color, castlingRights);
	}
}

function handleCastling(
	fenString: ParsedFEN,
	color: PieceColor,
	castlingSide: CastlingSide
): ParsedFEN {
	color = color.toLowerCase() as PieceColor;
	castlingSide = castlingSide.toLowerCase() as CastlingSide;

	const updatedFEN: ParsedFEN = structuredClone(fenString);
	const boardPlacement: BoardPlacement = structuredClone(
		updatedFEN["board_placement"]
	);
	const castlingRights: CastlingRights = structuredClone(
		updatedFEN["castling_rights"]
	);

	const disabledCastlingRights = disableCastling(color, castlingRights, [
		"kingside",
		"queenside",
	]);

	const kingStartingSquare = getKingStartingSquare(color);
	const kingCastledSquare = getKingCastledSquare(color, castlingSide);
	const rookStartingSquare = getRookStartingSquare(color, castlingSide);
	const rookCastledSquare = getCastledRookSquare(color, castlingSide);

	if (!canCastle(color, castlingSide, castlingRights)) {
		return updatedFEN;
	}

	const castledKingSquareInfo: SquareInfo = {
		piece_type: "king",
		piece_color: color,
		starting_square: kingStartingSquare,
	};

	const castledRookSquareInfo: SquareInfo = {
		piece_type: "rook",
		piece_color: color,
		starting_square: rookStartingSquare,
	};

	delete boardPlacement[`${kingStartingSquare}`];
	delete boardPlacement[`${rookStartingSquare}`];

	boardPlacement[`${kingCastledSquare}`] = castledKingSquareInfo;
	boardPlacement[`${rookCastledSquare}`] = castledRookSquareInfo;

	updatedFEN["board_placement"] = boardPlacement;
	updatedFEN["castling_rights"] = disabledCastlingRights;

	return updatedFEN;
}

function isCastling(
	startingSquare: string | number,
	destinationSquare: string | number
): boolean {
	startingSquare = Number(startingSquare);
	destinationSquare = Number(destinationSquare);

	return Math.abs(destinationSquare - startingSquare) === 2;
}

export { handleCastling, isCastling, disableCastling };
