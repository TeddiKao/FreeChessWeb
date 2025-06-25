import {
	BoardPlacement,
	ParsedFENString,
	PieceInfo,
} from "../../types/gameLogic.ts";

function clearStartingSquare(
	fenString: ParsedFENString,
	startingSquare: number | string
): ParsedFENString {
	const updatedFEN: ParsedFENString = structuredClone(fenString);
	const updatedBoardPlacement: BoardPlacement = structuredClone(
		updatedFEN["board_placement"]
	);

	delete updatedBoardPlacement[`${startingSquare}`];

	updatedFEN["board_placement"] = updatedBoardPlacement;

	return updatedFEN;
}

function addPieceToDestinationSquare(
	fenString: ParsedFENString,
	destinationSquare: string | number,
	pieceInfo: PieceInfo
): ParsedFENString {
	const updatedFEN: ParsedFENString = structuredClone(fenString);
	const updatedBoardPlacement: BoardPlacement = structuredClone(
		updatedFEN["board_placement"]
	);

	updatedBoardPlacement[`${destinationSquare}`] = pieceInfo;
	updatedFEN["board_placement"] = updatedBoardPlacement;
	return updatedFEN;
}

export { clearStartingSquare, addPieceToDestinationSquare };
