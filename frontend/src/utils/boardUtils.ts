import { ChessboardSquareIndex } from "../types/general";

function clearSquaresStyling(): void {
    for (let square = 0; square <= 63; square++) {
        const squareElement = document.getElementById(`${square}`);
        if (squareElement) {
            squareElement.classList.remove("legal-square");
        }
    }
}

function getRank(square: number | string): number {
    return Math.ceil((Number(square) + 1) / 8 - 1);
}

function getFile(square: number | string): number {
    return Number(square) % 8;
}

function getBoardStartingIndex(row: number, boardOrientation: string): number {
    const whiteOrientationStartingIndex = (row - 1) * 8 + 1;
    const blackOrientationStartingIndex = row * 8;

    const isWhite = boardOrientation.toLowerCase() === "white";

    return isWhite
        ? whiteOrientationStartingIndex
        : blackOrientationStartingIndex;
}

function getBoardEndingIndex(row: number, boardOrientation: string): number {
    const whiteOrientationEndingIndex = row * 8;
    const blackOrientationEndingIndex = (row - 1) * 8 + 1;

    const isWhite = boardOrientation.toLowerCase() === "white";

    return isWhite ? whiteOrientationEndingIndex : blackOrientationEndingIndex;
}

function isSquareLight(square: number | string) {
    const squareFile = getFile(square);
    const squareRank = getRank(square);

    return (squareFile + squareRank) % 2 !== 0;
}

function getSquareExists(square: number | string, boardPlacement: object) {
    return Object.keys(boardPlacement).includes(`${square}`);
}

function isSquareOnFileEdge(square: number, sideToCheck: "top" | "bottom" | "both") {
    if (sideToCheck === "top") {
        return getRank(square) === 0;
    } else if (sideToCheck === "bottom") {
        return getRank(square) === 7;
    } else if (sideToCheck === "both") {
        return getRank(square) in [0, 7];
    }
}

function isSquareOnRankEdge(square: number, sideToCheck: "left" | "right" | "both") {
    if (sideToCheck === "left") {
        return getFile(square) === 0;
    } else if (sideToCheck === "right") {
        return getFile(square) === 7;
    } else if (sideToCheck === "both") {
        return getFile(square) in [0, 7];
    }
}

function getSquareClass(square: string, previousDraggedSquare: string, previousDroppedSquare: string) {
    const squareColor = isSquareLight(square) ? "light" : "dark";
    
    if (square === previousDraggedSquare) {
        return "previous-dragged-square";
    } else if (square === previousDroppedSquare) {
        return "previous-dropped-square";
    } else {
        return `chessboard-square ${squareColor}`;
    }
}

function calculateXYTransform(startingSquare: ChessboardSquareIndex, destinationSquare: ChessboardSquareIndex, squareWidth: number = 55) {
    const startingSquareRank = getRank(startingSquare);
    const startingSquareFile = getFile(startingSquare);
    const destinationSquareRank = getRank(destinationSquare);
    const destinationSquareFile = getFile(destinationSquare);

    const rankDiff = startingSquareRank - destinationSquareRank;
    const fileDiff = startingSquareFile - destinationSquareFile;

    console.log(rankDiff, fileDiff);

    const xTransform = fileDiff * squareWidth * -1;
    const yTransform = rankDiff * squareWidth;

    return [xTransform, yTransform];
}

export {
    clearSquaresStyling,
    getRank,
    getFile,
    getBoardStartingIndex,
    getBoardEndingIndex,
    isSquareLight,
    getSquareExists,
    isSquareOnRankEdge,
    isSquareOnFileEdge,
    getSquareClass,
    calculateXYTransform
};
