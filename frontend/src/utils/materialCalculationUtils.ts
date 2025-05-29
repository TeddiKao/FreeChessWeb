import { pieceValueMapping } from "../constants/pieceValues";
import { CapturedPiecesList } from "../interfaces/materialCalculation";
import { CapturablePiece, CapturablePiecePlural } from "../types/gameLogic";

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

export { calculateTotalCapturedPiecesValue }