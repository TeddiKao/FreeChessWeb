import {
	BoardPlacement,
	MoveInfo,
	ParsedFENString,
	PieceColor,
	PieceType,
} from "../../types/gameLogic.ts";
import { ChessboardSquareIndex, OptionalValue } from "../../types/general.ts";
import { getRank } from "../boardUtils.ts";

function resetEnPassantTargetSquare(
	fenString: ParsedFENString
): ParsedFENString {
	const updatedFENString: ParsedFENString = structuredClone(fenString);
	updatedFENString["en_passant_target_square"] = null;

	return updatedFENString;
}

function updateEnPassantTargetSquare(
	fenString: ParsedFENString,
	{ starting_square, destination_square, piece_type, piece_color }: MoveInfo
): ParsedFENString {
	piece_type = piece_type.toLowerCase() as PieceType;
	piece_color = piece_color.toLowerCase() as PieceColor;

	const updatedFEN: ParsedFENString = structuredClone(fenString);

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
	fenString: ParsedFENString,
	destinationSquare: ChessboardSquareIndex
): ParsedFENString {
	const enPassantSquare: OptionalValue<number> =
		fenString["en_passant_target_square"];

	if (!enPassantSquare) {
		return fenString;
	}

	if (!isEnPassant(destinationSquare, enPassantSquare)) {
		return fenString;
	}

	const updatedFEN: ParsedFENString = structuredClone(fenString);
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
