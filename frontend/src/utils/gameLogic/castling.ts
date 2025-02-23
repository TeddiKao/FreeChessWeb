import {
    whiteKingStartingSquare,
    blackKingStartingSquare,
    rookStartingSquares,
} from "../../constants/castlingSquares.js";
import { BoardPlacement, CastlingRights, ParsedFENString } from "../../types/gameLogic.ts";
import { capitaliseFirstLetter } from "../generalUtils.ts";

function getKingStartingSquare(color: string): number {
    color = color.toLowerCase();

    if (color === "white") {
        return whiteKingStartingSquare;
    } else {
        return blackKingStartingSquare;
    }
}

function getKingCastledSquare(color: string, castlingSide: string): number {
    castlingSide = castlingSide.toLowerCase();

    const startingSquare: number = getKingStartingSquare(color);
    const isCastlingKinsgside: boolean = castlingSide === "kingside";

    // Offset from original king square
    const squareOffset: number = isCastlingKinsgside ? 2 : -2;

    return startingSquare + squareOffset;
}

function getCastledRookSquare(color: string, castlingSide: string): number {
    color = color.toLowerCase();
    castlingSide = castlingSide.toLowerCase();

    const rookStartingSquare: number = getRookStartingSquare(
        color,
        castlingSide
    );
    const isCastlingKinsgside: boolean = castlingSide === "kingside";

    // Offset from original rook square
    const squareOffset: number = isCastlingKinsgside ? -2 : 3;

    return rookStartingSquare + squareOffset;
}

function getRookStartingSquare(color: string, castlingSide: string): number {
    color = color.toLowerCase();
    castlingSide = castlingSide.toLowerCase();

    return rookStartingSquares[color][castlingSide];
}

function disableCastling(
    color: string,
    castlingRights: CastlingRights,
    castlingSides: Array<string>
): CastlingRights {
    const updatedCastlingRights: CastlingRights = structuredClone(castlingRights);

    color = color.toLowerCase();

    for (const castlingSide of castlingSides) {
        updatedCastlingRights[capitaliseFirstLetter(color)][castlingSide] =
            false;
    }

    return updatedCastlingRights;
}

function canCastleKingside(color: string, castlingRights: CastlingRights): boolean {
    return castlingRights[capitaliseFirstLetter(color)]["Kingside"];
}

function canCastleQueenside(color: string, castlingRights: CastlingRights): boolean {
    return castlingRights[capitaliseFirstLetter(color)]["Queenside"];
}

function canCastle(color: string, castlingSide: string, castlingRights: CastlingRights) {
    color = color.toLowerCase();
    castlingSide = castlingSide.toLowerCase();

    if (castlingSide === "kingside") {
        return canCastleKingside(color, castlingRights);
    } else {
        return canCastleQueenside(color, castlingRights);
    }
}

function handleCastling(fenString: ParsedFENString, color: string, castlingSide: string): object | null {
    color = color.toLowerCase();
    castlingSide = castlingSide.toLowerCase();

    console.log(fenString);

    const updatedFEN: ParsedFENString = structuredClone(fenString);
    const boardPlacement: BoardPlacement = structuredClone(updatedFEN["board_placement"]);
    const castlingRights: CastlingRights = structuredClone(updatedFEN["castling_rights"]);

    const disabledCastlingRights = disableCastling(color, castlingRights, [
        "Kingside",
        "Queenside",
    ]);

    const kingStartingSquare = getKingStartingSquare(color);
    const kingCastledSquare = getKingCastledSquare(color, castlingSide);
    const rookStartingSquare = getRookStartingSquare(color, castlingSide);
    const rookCastledSquare = getCastledRookSquare(color, castlingSide);

    console.log(kingStartingSquare, kingCastledSquare);
    console.log(rookStartingSquare, kingStartingSquare);

    if (!canCastle(color, castlingSide, castlingRights)) {
        return null;
    }

    const castledKingSquareInfo = {
        piece_type: "King",
        piece_color: capitaliseFirstLetter(color),
        starting_square: kingStartingSquare,
    };

    const castledRookSquareInfo = {
        piece_type: "Rook",
        piece_color: capitaliseFirstLetter(color),
        starting_square: rookStartingSquare,
    };

    delete boardPlacement[`${kingStartingSquare}`];
    delete boardPlacement[`${rookStartingSquare}`];

    boardPlacement[`${kingCastledSquare}`] = castledKingSquareInfo;
    boardPlacement[`${rookCastledSquare}`] = castledRookSquareInfo;

    updatedFEN["board_placement"] = boardPlacement;
    updatedFEN["castling_rights"] = disabledCastlingRights;

    console.log(updatedFEN);

    return updatedFEN;
}

function isCastling(startingSquare: string | number, destinationSquare: string | number): boolean {
    startingSquare = Number(startingSquare);
    destinationSquare = Number(destinationSquare);

    return Math.abs(destinationSquare - startingSquare) === 2;
}

export { handleCastling, isCastling, disableCastling };
