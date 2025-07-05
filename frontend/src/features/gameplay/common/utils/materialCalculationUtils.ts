import {
	pluralToSingularPieceMap,
	singularToPluralPieceMap,
} from "../../../../shared/constants/pieceMappings";
import { pieceValueMapping } from "../../../../shared/constants/pieceValues";
import {
	CapturedPiecesList,
	PromotedPiecesList,
} from "../../../../shared/types/chessTypes/gameState.types";
import {
	CapturablePiecePlural,
	PromotionPiecePlural,
} from "../../../../shared/types/chessTypes/pieces.types";

function calculateTotalCapturedPiecesValue(
	capturedPiecesList: CapturedPiecesList
) {
	let totalCapturedPiecesValue = 0;
	for (const piece in capturedPiecesList) {
		const pieceSingularForm = pluralToSingularPieceMap[piece];

		const pieceValue = pieceValueMapping[pieceSingularForm];
		const numPieces = capturedPiecesList[piece as CapturablePiecePlural];
		const totalPieceValue = pieceValue * numPieces;

		totalCapturedPiecesValue += totalPieceValue;
	}

	return totalCapturedPiecesValue;
}

function calculateTotalPromotedPiecesValue(
	promotedPiecesList: PromotedPiecesList
) {
	let totalPromotedPiecesValue = 0;
	for (const piece in promotedPiecesList) {
		const pieceSingularForm = pluralToSingularPieceMap[piece];

		const pieceValue = pieceValueMapping[pieceSingularForm];
		const numPieces = promotedPiecesList[piece as PromotionPiecePlural];
		const totalPieceValue = pieceValue * numPieces;

		totalPromotedPiecesValue += totalPieceValue;
	}

	return totalPromotedPiecesValue;
}

function calculateTotalActualCapturedValue(
	ownCapturedPiecesList: CapturedPiecesList,
	opponentPromotedPiecesList: PromotedPiecesList
) {
	const totalCapturedPiecesValue = calculateTotalCapturedPiecesValue(
		ownCapturedPiecesList
	);

	const opponentPromotedPiecesValue = calculateTotalPromotedPiecesValue(
		opponentPromotedPiecesList
	);

	return totalCapturedPiecesValue - opponentPromotedPiecesValue;
}

export {
	calculateTotalCapturedPiecesValue,
	calculateTotalPromotedPiecesValue,
	calculateTotalActualCapturedValue,
};
