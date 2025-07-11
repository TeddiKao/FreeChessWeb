import { useEffect, useState } from "react";
import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";

function useDraggedSquaresState() {
	const [draggedSquare, setDraggedSquare] =
		useState<ChessboardSquareIndex | null>(null);
	const [droppedSquare, setDroppedSquare] =
		useState<ChessboardSquareIndex | null>(null);

	return {
		draggedSquare,
		setDraggedSquare,
		droppedSquare,
		setDroppedSquare,
	};
}

export default useDraggedSquaresState;
