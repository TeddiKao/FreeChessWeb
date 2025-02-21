import { useDrag, useDrop } from "react-dnd";

import "../styles/chessboard/square.css"
import PromotionPopup from "./PromotionPopup.jsx";
import { useEffect, useState } from "react";
import { getFile, getRank, isSquareLight } from "../utils/boardUtils.js";

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
    orientation,
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

    function clearAllHighlightedSquares() {
        for (let square = 0; square <= 63; square++) {
            const squareElement = document.getElementById(`${square}`);
            if (squareElement) {
                const highlightedClassName = isSquareLight(square) ? "highlighted-square-light" : "highlighted-square-dark";

                squareElement.classList.remove(highlightedClassName);
            }
        }
    }

    function handleSquareHiglight(event) {
        event.preventDefault(); 

        const squareId = event.target.id;
        
        const squareFile = getFile(squareId);
        const squareRank = getRank(squareId);

        const isSquareLight = (squareFile + squareRank) % 2 !== 0;
        const highlightedClassName = isSquareLight ? "highlighted-square-light" : "highlighted-square-dark";

        event.target.classList.add(highlightedClassName);
    }

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
                    boardOrientation={orientation}
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
                clearAllHighlightedSquares();
            }}

            onContextMenu={handleSquareHiglight}
        >
            {pieceColor && pieceType ? generateSquareHTML() : null}
        </div>
    );
}

export default Square;
