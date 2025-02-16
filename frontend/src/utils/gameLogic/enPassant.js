import { PieceColor, PieceType } from "../../enums/pieces.js";
import { getRank } from "../boardUtils.js";

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

export { updateEnPassantTargetSquare }