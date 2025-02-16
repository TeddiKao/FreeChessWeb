import {
    whiteKingStartingSquare,
    blackKingStartingSquare,
    rookStartingSquares,
} from "../../constants/castlingSquares.js";
import { fetchMoveIsValid } from "../apiUtils.js";
import { capitaliseFirstLetter } from "../generalUtils.js";

function getKingStartingSquare(color) {
    if (color.toLowerCase() === "white") {
        return whiteKingStartingSquare;
    } else {
        return blackKingStartingSquare;
    }
}

function getKingCastledSquare(color, castlingSide) {
    castlingSide = castlingSide.toLowerCase();

    const startingSquare = getKingStartingSquare(color);
    const isCastlingKinsgside = castlingSide === "kingside";

    // Offset from original king square
    const squareOffset = isCastlingKinsgside ? 2 : -2;

    return startingSquare + squareOffset;
}

function getCastledRookSquare(color, castlingSide) {
    color = color.toLowerCase();
    castlingSide = castlingSide.toLowerCase();

    const rookStartingSquare = getRookStartingSquare(color, castlingSide);
    const isCastlingKinsgside = castlingSide === "kingside";

    // Offset from original rook square
    const squareOffset = isCastlingKinsgside ? -2 : 3;

    return rookStartingSquare + squareOffset;
}

function getRookStartingSquare(color, castlingSide) {
    color = color.toLowerCase();
    castlingSide = castlingSide.toLowerCase();

    return rookStartingSquares[color][castlingSide];
}

function disableCastling(color, castlingRights, castlingSides) {
    const updatedCastlingRights = structuredClone(castlingRights);

    color = color.toLowerCase();
    console.log(color);

    for (const castlingSide of castlingSides) {
        updatedCastlingRights[capitaliseFirstLetter(color)][
            castlingSide
        ] = false;
    }

    return updatedCastlingRights;
}

function canCastleKingside(color, castlingRights) {
    return castlingRights[capitaliseFirstLetter(color)]["Kingside"];
}

function canCastleQueenside(color, castlingRights) {
    return castlingRights[capitaliseFirstLetter(color)]["Queenside"];
}

function canCastle(color, castlingSide, castlingRights) {
    color = color.toLowerCase();
    castlingSide = castlingSide.toLowerCase();

    if (castlingSide === "kingside") {
        return canCastleKingside(color, castlingRights);
    } else {
        return canCastleQueenside(color, castlingRights);
    }
}

function handleCastling(fenString, color, castlingSide) {
    color = color.toLowerCase();
    castlingSide = castlingSide.toLowerCase();

    console.log(fenString);

    const updatedFEN = structuredClone(fenString);
    const boardPlacement = structuredClone(updatedFEN["board_placement"]);
    const castlingRights = structuredClone(updatedFEN["castling_rights"]);

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

function isCastling(startingSquare, destinationSquare) {
    startingSquare = Number(startingSquare);
    destinationSquare = Number(destinationSquare);

    return Math.abs(destinationSquare - startingSquare) === 2;
}

export { handleCastling, isCastling, disableCastling };
