import api from "../../../../app/api";
import { ChessboardSquareIndex } from "../../../../shared/types/utility.types";
import { ParsedFEN } from "../../../../shared/types/gameState.types";

async function displayLegalMoves(
	parsedFEN: ParsedFEN,
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
	parsedFEN: ParsedFEN,
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

async function fetchLegalMoves(
	parsedFENString: object,
	pieceType: string,
	pieceColor: string,
	startingSquare: string | number
) {
	let legalMoves = [];

	try {
		const response = await api.post(
			"/move_validation_api/show-legal-moves/",
			{
				parsed_fen_string: parsedFENString,
				move_info: {
					piece_color: pieceColor,
					piece_type: pieceType,
					starting_square: startingSquare,
				},
			}
		);

		if (response.status === 200) {
			legalMoves = response.data;
		}
	} catch (error) {
		console.log(error);
	}

	return legalMoves;
}

async function fetchMoveIsValid(
	parsedFENString: object,
	piece_color: string,
	piece_type: string,
	starting_square: number | string,
	destination_square: number | string,
	additional_info: object = {}
) {
	let isMoveLegal = false;
	let moveType = null;

	try {
		const response = await api.post("/move_validation_api/validate-move/", {
			parsed_fen_string: parsedFENString,
			move_info: {
				piece_color: piece_color,
				piece_type: piece_type,
				starting_square: starting_square,
				destination_square: destination_square,
				additional_info: additional_info,
			},
		});

		if (response.status === 200) {
			isMoveLegal = response.data.is_valid;
			moveType = response.data.move_type;
		}
	} catch (error) {
		console.log(error);
	}

	return [isMoveLegal, moveType];
}

export {
	displayLegalMoves,
	performMoveValidation,
	fetchLegalMoves,
	fetchMoveIsValid,
};
