import useClickedSquaresState from "../../multiplayer/hooks/useClickedSquaresState";
import useDraggedSquaresState from "../../multiplayer/hooks/useDraggedSquaresState";
import usePassAndPlayFen from "./usePassAndPlayFen";
import usePreviousMoveSquares from "./usePreviousMoveSquares";

function usePassAndPlayLogic() {
    const {
        clickedSquare,
        setClickedSquare,
        prevClickedSquare,
        setPrevClickedSquare,
    } = useClickedSquaresState();

    const { draggedSquare, setDraggedSquare, droppedSquare, setDroppedSquare } =
        useDraggedSquaresState();

    const {
        previousDraggedSquare,
        setPreviousDraggedSquare,
        previousDroppedSquare,
        setPreviousDroppedSquare,
    } = usePreviousMoveSquares();

    const { parsedFEN, setParsedFEN } = usePassAndPlayFen();

    return {
        clickedSquare,
        setClickedSquare,
        prevClickedSquare,
        setPrevClickedSquare,
        draggedSquare,
        setDraggedSquare,
        droppedSquare,
        setDroppedSquare,
        previousDraggedSquare,
        setPreviousDraggedSquare,
        previousDroppedSquare,
        setPreviousDroppedSquare,

        parsedFEN,
        setParsedFEN,
    };
}

export default usePassAndPlayLogic;
