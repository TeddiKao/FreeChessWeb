import { ParsedFENString } from "../types/gameLogic";
import { ChessboardSquareIndex } from "../types/general";
import { fetchLegalMoves, fetchMoveIsValid } from "./apiUtils";

async function displayLegalMoves(
	parsedFEN: ParsedFENString,
	startSquare: ChessboardSquareIndex
) {
	const squareInfo = parsedFEN["board_placement"][startSquare.toString()];
	const pieceType = squareInfo["piece_type"];
	const pieceColor = squareInfo["piece_color"];

	const legalMoves = await fetchLegalMoves(
		parsedFEN,
		pieceType,
		pieceColor,
		startSquare.toString()
	);

	if (!legalMoves) return;

	for (const legalMove of legalMoves) {
		const square = document.getElementById(legalMove);
		if (!square) continue;

		square.classList.add("legal-square");
	}
}

async function performMoveValidation(
	parsedFEN: ParsedFENString,
	startSquare: ChessboardSquareIndex,
	destinationSquare: ChessboardSquareIndex
) {
	if (!parsedFEN) return;

	const boardPlacement = parsedFEN["board_placement"];
	const squareInfo = boardPlacement[startSquare.toString()];
	const pieceColor = squareInfo["piece_color"];
	const pieceType = squareInfo["piece_type"];

	const [isValidMove, _] = await fetchMoveIsValid(
		parsedFEN,
		pieceColor,
		pieceType,
		startSquare.toString(),
		destinationSquare.toString()
	);

	return isValidMove;
}

export { displayLegalMoves, performMoveValidation };