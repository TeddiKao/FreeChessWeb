import {
	BoardPlacement,
	ParsedFEN,
} from "../../../../shared/types/gameState.types.ts";
import { PieceInfo } from "../../../../shared/types/pieces.types.ts";

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
