import {
	BoardPlacement,
	ParsedFEN,
} from "@sharedTypes/chessTypes/gameState.types";
import { PieceInfo } from "@sharedTypes/chessTypes/pieces.types";

function clearStartingSquare(
	fenString: ParsedFEN,
	startingSquare: number | string
): ParsedFEN {
	const updatedFEN: ParsedFEN = structuredClone(fenString);
	const updatedBoardPlacement: BoardPlacement = structuredClone(
		updatedFEN["board_placement"]
	);

	delete updatedBoardPlacement[`${startingSquare}`];

	updatedFEN["board_placement"] = updatedBoardPlacement;

	return updatedFEN;
}

function addPieceToDestinationSquare(
	fenString: ParsedFEN,
	destinationSquare: string | number,
	pieceInfo: PieceInfo
): ParsedFEN {
	const updatedFEN: ParsedFEN = structuredClone(fenString);
	const updatedBoardPlacement: BoardPlacement = structuredClone(
		updatedFEN["board_placement"]
	);

	updatedBoardPlacement[`${destinationSquare}`] = pieceInfo;
	updatedFEN["board_placement"] = updatedBoardPlacement;
	return updatedFEN;
}

export { clearStartingSquare, addPieceToDestinationSquare };
