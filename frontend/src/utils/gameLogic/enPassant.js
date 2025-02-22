import { PieceColor, PieceType } from "../../enums/pieces.js";
import { getRank } from "../boardUtils.ts";

function resetEnPassantTargetSquare(fenString) {
    const updatedFENString = structuredClone(fenString);
    updatedFENString["en_passant_target_square"] = null;

    return updatedFENString;
}

function updateEnPassantTargetSquare(
    fenString,
    { startingSquare, destinationSquare, pieceType, pieceColor }
) {
    pieceType = pieceType.toLowerCase();
    pieceColor = pieceColor.toLowerCase();

	const updatedFEN = structuredClone(fenString);

    if (pieceType !== PieceType.PAWN) {
        return resetEnPassantTargetSquare(updatedFEN);
    }

    const startingRank = getRank(startingSquare);
    const destinationRank = getRank(destinationSquare);

    if (Math.abs(startingRank - destinationRank) !== 2) {
        return resetEnPassantTargetSquare(updatedFEN);
    }

    const isPawnWhite = pieceColor === PieceColor.WHITE;
    const enPassantSquareOffsetFromDestination = isPawnWhite ? -8 : 8;

    const enPassantSquare =
        Number(destinationSquare) + enPassantSquareOffsetFromDestination;

	updatedFEN["en_passant_target_square"] = enPassantSquare;

	return updatedFEN;
}

function isEnPassant(destinationSquare, enPassantTargetSquare) {
	return Number(destinationSquare) === Number(enPassantTargetSquare);
}

function getEnPassantPawnLocation(enPassantSquare) {
	const pawnRank = getRank(enPassantSquare);
	const isPawnWhite = pawnRank === 2;

	return isPawnWhite ? enPassantSquare + 8 : enPassantSquare - 8;
}

function handleEnPassant(fenString, destinationSquare) {
	const enPassantSquare = fenString["en_passant_target_square"]

	if (!isEnPassant(destinationSquare, enPassantSquare)) {
		return fenString;
	}

	const updatedFEN = structuredClone(fenString);
	const updatedBoardPlacement = structuredClone(fenString["board_placement"]);

	const pawnToCaptureLocation = getEnPassantPawnLocation(enPassantSquare);

	delete updatedBoardPlacement[`${pawnToCaptureLocation}`];

	updatedFEN["board_placement"] = updatedBoardPlacement;
	updatedFEN["en_passant_target_square"] = null;

	return updatedFEN;
}

export { updateEnPassantTargetSquare, handleEnPassant }