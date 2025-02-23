import { PieceColor, PieceType } from "../../enums/pieces.js";
import { BoardPlacement, ParsedFENString } from "../../types/gameLogic.ts";
import { ChessboardSquareIndex, OptionalValue } from "../../types/general.ts";
import { getRank } from "../boardUtils.ts";

function resetEnPassantTargetSquare(fenString: ParsedFENString): ParsedFENString {
    const updatedFENString: ParsedFENString = structuredClone(fenString);
    updatedFENString["en_passant_target_square"] = null;

    return updatedFENString;
}

function updateEnPassantTargetSquare(
    fenString: ParsedFENString,
    { startingSquare, destinationSquare, pieceType, pieceColor }: any
): ParsedFENString {
    pieceType = pieceType.toLowerCase();
    pieceColor = pieceColor.toLowerCase();

    const updatedFEN: ParsedFENString = structuredClone(fenString);

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

function isEnPassant(destinationSquare: ChessboardSquareIndex, enPassantTargetSquare: OptionalValue<ChessboardSquareIndex>): boolean {
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
    const enPassantSquare: OptionalValue<number> = fenString["en_passant_target_square"];
    if (!enPassantSquare) {
        return fenString
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
