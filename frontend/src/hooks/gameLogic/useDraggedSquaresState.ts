import { useEffect, useState } from "react";
import { ChessboardSquareIndex } from "../../types/general";

function useDraggedSquaresState(onDragDropCallback: () => void) {
    const [draggedSquare, setDraggedSquare] =
		useState<ChessboardSquareIndex | null>(null);
	const [droppedSquare, setDroppedSquare] =
		useState<ChessboardSquareIndex | null>(null);

    useEffect(() => {
        onDragDropCallback();
    }, [draggedSquare, droppedSquare, onDragDropCallback]);

    return {
        draggedSquare,
        setDraggedSquare,
        droppedSquare,
        setDroppedSquare,
    };
}

export default useDraggedSquaresState;