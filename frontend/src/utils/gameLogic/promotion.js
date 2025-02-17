function clearUnpromotedPawn(boardPlacement, previousDroppedSquare) {
	const updatedBoardPlacement = structuredClone(boardPlacement);

    delete updatedBoardPlacement[`${previousDroppedSquare}`]

	return updatedBoardPlacement;
}

function restoreCapturedPiece(boardPlacement, capturedPieceInfo, capturedPieceLocation) {
	const updatedBoardPlacement = structuredClone(boardPlacement);
	updatedBoardPlacement[`${capturedPieceLocation}`] = capturedPieceInfo;

	return updatedBoardPlacement;
}

function cancelPromotion(fenString, color, previousDraggedSquare, previousDroppedSquare, promotionCapturedPiece) {
	const updatedFENString = structuredClone(fenString);
	let updatedBoardPlacement = structuredClone(updatedFENString["board_placement"]);

	// Removes the pawn from the promotion square
	updatedBoardPlacement = clearUnpromotedPawn(updatedBoardPlacement, previousDroppedSquare)

	updatedBoardPlacement[`${previousDraggedSquare}`] = {
		piece_type: "Pawn",
        piece_color: color
	}

	if (promotionCapturedPiece) {
		updatedBoardPlacement = restoreCapturedPiece(updatedBoardPlacement, promotionCapturedPiece, previousDroppedSquare);
	}

	updatedFENString["board_placement"] = updatedBoardPlacement;
	return updatedFENString;
}

export { cancelPromotion };
