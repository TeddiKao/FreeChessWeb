import { PieceColor, PieceType } from "../../enums/pieces.js";
import { getRank } from "../boardUtils.ts";

function resetEnPassantTargetSquare(fenString: object): object {
    const updatedFENString: object = structuredClone(fenString);
    updatedFENString["en_passant_target_square"] = null;

    return updatedFENString;
}

function updateEnPassantTargetSquare(
    fenString: object,
    { startingSquare, destinationSquare, pieceType, pieceColor }
): object {
    pieceType = pieceType.toLowerCase();
    pieceColor = pieceColor.toLowerCase();

    const updatedFEN: object = structuredClone(fenString);

    if (pieceType !== PieceType.PAWN) {
        return resetEnPassantTargetSquare(updatedFEN);
    }

    const startingRank: number = getRank(startingSquare);
    const destinationRank: number = getRank(destinationSquare);

    if (Math.abs(startingRank - destinationRank) !== 2) {
        return resetEnPassantTargetSquare(updatedFEN);
    }

    const isPawnWhite: boolean = pieceColor === PieceColor.WHITE;
    const enPassantSquareOffsetFromDestination: number = isPawnWhite ? -8 : 8;

    const enPassantSquare: number =
        Number(destinationSquare) + enPassantSquareOffsetFromDestination;

    updatedFEN["en_passant_target_square"] = enPassantSquare;

    return updatedFEN;
}

function isEnPassant(destinationSquare: string | number, enPassantTargetSquare: number): boolean {
    return Number(destinationSquare) === Number(enPassantTargetSquare);
}

function getEnPassantPawnLocation(enPassantSquare: number): number {
    const pawnRank = getRank(enPassantSquare);
    const isPawnWhite = pawnRank === 2;

    return isPawnWhite ? enPassantSquare + 8 : enPassantSquare - 8;
}

function handleEnPassant(
    fenString: object,
    destinationSquare: number | string
): object {
    const enPassantSquare: number = fenString["en_passant_target_square"];

    if (!isEnPassant(destinationSquare, enPassantSquare)) {
        return fenString;
    }

    const updatedFEN: object = structuredClone(fenString);
    const updatedBoardPlacement: object = structuredClone(
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
