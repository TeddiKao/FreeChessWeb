function clearStartingSquare(fenString, startingSquare) {
	const updatedFEN = structuredClone(fenString);
	const updatedBoardPlacement = structuredClone(updatedFEN["board_placement"]);

	delete updatedBoardPlacement[`${startingSquare}`];

	updatedFEN["board_placement"] = updatedBoardPlacement;

	return updatedFEN;
}

function addPieceToDestinationSquare(fenString, destinationSquare, pieceInfo) {
	const updatedFEN = structuredClone(fenString);
	const updatedBoardPlacement = structuredClone(updatedFEN["board_placement"]);

	updatedBoardPlacement[`${destinationSquare}`] = pieceInfo;
	updatedFEN["board_placement"] = updatedBoardPlacement;
	return updatedFEN;
}

export { clearStartingSquare, addPieceToDestinationSquare };