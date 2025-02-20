function clearSquaresStyling() {
    for (let square = 0; square <= 63; square++) {
        const squareElement = document.getElementById(`${square}`);
        if (squareElement) {
            squareElement.classList.remove("legal-square");
        }
    }
}

function getRank(square) {
    return Math.ceil((parseInt(square) + 1) / 8 - 1);
}

function getFile(square) {
    return parseInt(square) % 8;
}

function getBoardStartingIndex(row, boardOrientation) {
    const whiteOrientationStartingIndex = (row - 1) * 8 + 1;
    const blackOrientationStartingIndex = row * 8;

    const isWhite = boardOrientation.toLowerCase() === "white";

    return isWhite
        ? whiteOrientationStartingIndex
        : blackOrientationStartingIndex;
}

function getBoardEndingIndex(row, boardOrientation) {
    const whiteOrientationEndingIndex = row * 8;
    const blackOrientationEndingIndex = (row - 1) * 8 + 1;

    const isWhite = boardOrientation.toLowerCase() === "white";

    return isWhite ? whiteOrientationEndingIndex : blackOrientationEndingIndex;
}

function isSquareLight(square) {
    const squareFile = getFile(square);
    const squareRank = getRank(square);

    return (squareFile + squareRank) % 2 !== 0;
}

function getSquareExists(square, boardPlacement) {
    return Object.keys(boardPlacement).includes(square);
}

export {
    clearSquaresStyling,
    getRank,
    getFile,
    getBoardStartingIndex,
    getBoardEndingIndex,
    isSquareLight,
    getSquareExists,
};
