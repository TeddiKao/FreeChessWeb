import { useDrag, useDrop } from "react-dnd";
import api from "../api.js";

import "../styles/square.css";
import PromotionPopup from "./PromotionPopup.jsx";
import { useEffect, useState } from "react";

function Square({
    squareNumber,
    squareColor,
    pieceColor,
    pieceType,
    displayPromotionPopup,
    handleSquareClick,
    setDraggedSquare,
    setDroppedSquare,
    handlePromotionCancel,
    handlePawnPromotion,
    previousDraggedSquare,
    previousDroppedSquare,
}) {
    let startingSquare = null;

    const [popupIsOpen, setPopupIsOpen] = useState(displayPromotionPopup);

    function getSquareClass() {
        if (squareNumber === previousDraggedSquare) {
            return "previous-dragged-square";
        } else if (squareNumber === previousDroppedSquare) {
            return "previous-dropped-square";
        } else {
            return `chessboard-square ${squareColor}`;
        }
    }

    useEffect(() => {
        setPopupIsOpen(displayPromotionPopup);
    }, [displayPromotionPopup]);

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

    function generateSquareHTML() {
        let squareHTML = null;
        if (displayPromotionPopup) {
            squareHTML = (
                <PromotionPopup
                    color={pieceColor}
                    isOpen={popupIsOpen}
                    onClose={() => {
                        setPopupIsOpen(false);
                    }}
                    handlePromotionCancel={handlePromotionCancel}
                    handlePawnPromotion={handlePawnPromotion}
                />
            );
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

        return squareHTML;
    }

    return (
        <div
            ref={drop}
            className={getSquareClass()}
            id={squareNumber}
            onClick={(event) => {
                handleSquareClick(event, squareNumber);
            }}
        >
            {pieceColor && pieceType ? generateSquareHTML() : null}
        </div>
    );
}

export default Square;
