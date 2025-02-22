function clearStartingSquare(
    fenString: object,
    startingSquare: number | string
): object {
    const updatedFEN: object = structuredClone(fenString);
    const updatedBoardPlacement: object = structuredClone(
        updatedFEN["board_placement"]
    );

    delete updatedBoardPlacement[`${startingSquare}`];

    updatedFEN["board_placement"] = updatedBoardPlacement;

    return updatedFEN;
}

function addPieceToDestinationSquare(
    fenString: object,
    destinationSquare: string | number,
    pieceInfo: object
): object {
    const updatedFEN: object = structuredClone(fenString);
    const updatedBoardPlacement: object = structuredClone(
        updatedFEN["board_placement"]
    );

    updatedBoardPlacement[`${destinationSquare}`] = pieceInfo;
    updatedFEN["board_placement"] = updatedBoardPlacement;
    return updatedFEN;
}

export { clearStartingSquare, addPieceToDestinationSquare };
