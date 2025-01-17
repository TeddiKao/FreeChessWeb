import { useDrag, useDrop } from "react-dnd";
import api from "../api.js";

import "../styles/square.css";
import PromotionPopup from "./PromotionPopup.jsx";

function Square({
    squareNumber,
    squareColor,
    pieceColor,
    pieceType,
    displayPromotionPopup,
    handleSquareClick,
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
        };
    });

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "square",
        drop: (item, monitor) => {
            startingSquare = item.id;

            handleOnDrop(squareNumber);
        },
    }));

    function handleOnDrop(droppedSquare) {
        setDraggedSquare(startingSquare);
        setDroppedSquare(droppedSquare);
    }

    function handleOnDrag(squareDragged) {
        setDraggedSquare(squareDragged);
    }

    let squareHTML = null;
    if (displayPromotionPopup) {
        squareHTML = <PromotionPopup color={pieceColor} />;
    } else {
        squareHTML = (
            <img
                ref={drag}
                onDrag={() => {
                    handleOnDrag(squareNumber);
                }}
                className="piece-image"
                src={`/${pieceColor.toLowerCase()}${pieceType}.svg`}
            />
        );
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
            {pieceColor && pieceType ? squareHTML : null}
        </div>
    );
}

export default Square;
