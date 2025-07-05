import { ChessboardSquareIndex } from "../../common/types/board.types.ts";
import {
	BoardPlacement,
	MoveInfo,
	ParsedFEN,
} from "../../common/types/gameState.types.ts";
import { PieceColor, PieceType } from "../../common/types/pieces.types.ts";
import { OptionalValue } from "../../../../shared/types/utility.types.ts";
import { getRank } from "../../../../utils/boardUtils.ts";

function resetEnPassantTargetSquare(fenString: ParsedFEN): ParsedFEN {
	const updatedFENString: ParsedFEN = structuredClone(fenString);
	updatedFENString["en_passant_target_square"] = null;

	return updatedFENString;
}

function updateEnPassantTargetSquare(
	fenString: ParsedFEN,
	{ starting_square, destination_square, piece_type, piece_color }: MoveInfo
): ParsedFEN {
	piece_type = piece_type.toLowerCase() as PieceType;
	piece_color = piece_color.toLowerCase() as PieceColor;

	const updatedFEN: ParsedFEN = structuredClone(fenString);

	if (piece_type !== "pawn") {
		return resetEnPassantTargetSquare(updatedFEN);
	}

	const startingRank: number = getRank(starting_square);
	const destinationRank: number = getRank(destination_square);

	if (Math.abs(startingRank - destinationRank) !== 2) {
		return resetEnPassantTargetSquare(updatedFEN);
	}

	const isPawnWhite: boolean = piece_color === "white";
	const enPassantSquareOffsetFromDestination: number = isPawnWhite ? -8 : 8;

	const enPassantSquare: number =
		Number(destination_square) + enPassantSquareOffsetFromDestination;

	updatedFEN["en_passant_target_square"] = enPassantSquare;

	return updatedFEN;
}

function isEnPassant(
	destinationSquare: ChessboardSquareIndex,
	enPassantTargetSquare: OptionalValue<ChessboardSquareIndex>
): boolean {
	return Number(destinationSquare) === Number(enPassantTargetSquare);
}

function getEnPassantPawnLocation(enPassantSquare: number): number {
	const pawnRank = getRank(enPassantSquare);
	const isPawnWhite = pawnRank === 2;

	return isPawnWhite ? enPassantSquare + 8 : enPassantSquare - 8;
}

function handleEnPassant(
	fenString: ParsedFEN,
	destinationSquare: ChessboardSquareIndex
): ParsedFEN {
	const enPassantSquare: OptionalValue<number> =
		fenString["en_passant_target_square"];

	if (!enPassantSquare) {
		return fenString;
	}

	if (!isEnPassant(destinationSquare, enPassantSquare)) {
		return fenString;
	}

	const updatedFEN: ParsedFEN = structuredClone(fenString);
	const updatedBoardPlacement: BoardPlacement = structuredClone(
		fenString["board_placement"]
	);

	const pawnToCaptureLocation: number =
		getEnPassantPawnLocation(enPassantSquare);

	delete updatedBoardPlacement[`${pawnToCaptureLocation}`];

	updatedFEN["board_placement"] = updatedBoardPlacement;
	updatedFEN["en_passant_target_square"] = null;

	return updatedFEN;
}

export { updateEnPassantTargetSquare, handleEnPassant };
