import { ChessboardSquareIndex } from "@/shared/types/chessTypes/board.types";
import { OptionalValue } from "@/shared/types/utility.types";
import { useState } from "react";

function usePreviousMoveSquares() {
    const [previousDraggedSquare, setPreviousDraggedSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(null);
	const [previousDroppedSquare, setPreviousDroppedSquare] =
		useState<OptionalValue<ChessboardSquareIndex>>(null);

    return {
        previousDraggedSquare,
        setPreviousDraggedSquare,
        previousDroppedSquare,
        setPreviousDroppedSquare,
    };
}

export default usePreviousMoveSquares;