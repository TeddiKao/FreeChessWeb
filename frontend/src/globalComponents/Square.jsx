import { useDrag, useDrop } from "react-dnd";
import api from "../api.js";

import "../styles/square.css";

function Square({
    squareNumber,
    squareColor,
    pieceColor,
    pieceType,
    handleSquareClick,
    setParsedFENString,
    setDraggedSquare,
    setDroppedSquare,
}) {
    let startingSquare = null;

    const [{ isDragging }, drag] = useDrag(() => {
        return {
            type: "square",
            item: { id: squareNumber },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }
    });

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "square",
        drop: (item, monitor) => {
            startingSquare = item.id;
            console.log(squareNumber);
            handleOnDrop(squareNumber);
        },
    }));

    function handleOnDrop(droppedSquare) {
        setDraggedSquare(startingSquare);
        setDroppedSquare(droppedSquare);
    }

    return (
        <div
            ref={drop}
            className={`chessboard-square ${squareColor}`}
            id={squareNumber}
            onClick={(event) => {
                handleSquareClick(event, squareNumber);
            }}
        >
            {pieceColor && pieceType ? (
                <img
                    ref={drag}
                    className="piece-image"
                    src={`../../public/${pieceColor.toLowerCase()}${pieceType}.svg`}
                />
            ) : null}
        </div>
    );
}

export default Square;
