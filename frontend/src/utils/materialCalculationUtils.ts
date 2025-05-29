import { pieceValueMapping } from "../constants/pieceValues";
import { CapturedPiecesList, PromotedPiecesList } from "../interfaces/materialCalculation";
import { CapturablePiece, CapturablePiecePlural, PromotionPiece, PromotionPiecePlural } from "../types/gameLogic";

function calculateTotalCapturedPiecesValue(capturedPiecesList: CapturedPiecesList) {
    let totalCapturedPiecesValue = 0;
    for (const piece in capturedPiecesList) {
        const pieceSingularForm = piece.slice(0, -1) as CapturablePiece
        
        const pieceValue = pieceValueMapping[pieceSingularForm];
        const numPieces = capturedPiecesList[piece as CapturablePiecePlural];
        const totalPieceValue = pieceValue * numPieces;

        totalCapturedPiecesValue += totalPieceValue;
    }

    return totalCapturedPiecesValue;
}

function calculateTotalPromotedPiecesValue(promotedPiecesList: PromotedPiecesList) {
    let totalPromotedPiecesValue = 0;
    for (const piece in promotedPiecesList) {
        const pieceSingularForm = piece.slice(0, -1) as CapturablePiece
        
        const pieceValue = pieceValueMapping[pieceSingularForm];
        const numPieces = promotedPiecesList[piece as PromotionPiecePlural];
        const totalPieceValue = pieceValue * numPieces;

        totalPromotedPiecesValue += totalPieceValue;
    }

    return totalPromotedPiecesValue;
} 

export { calculateTotalCapturedPiecesValue, calculateTotalPromotedPiecesValue }