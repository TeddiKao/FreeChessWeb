import { useDrag, useDrop } from "react-dnd";

import "../styles/chessboard/square.css";
import PromotionPopup from "./PromotionPopup.js";
import React, { useEffect, useState } from "react";
import { getFile, getRank, isSquareLight } from "../utils/boardUtils";
import { SquareProps } from "../interfaces/chessboard.js";
import { OptionalValue } from "../types/general.js";


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
}: SquareProps) {
    let startingSquare: OptionalValue<string> = null;

    const [popupIsOpen, setPopupIsOpen] = useState<boolean>(displayPromotionPopup);

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

    const [{ isOver }, drop]: any = useDrop(() => ({
        accept: "square",
        drop: (item: any, _) => {
            startingSquare = item.id;

            handleOnDrop(squareNumber);
        },
    }));

    function clearAllHighlightedSquares(): void {
        for (let square = 0; square <= 63; square++) {
            const squareElement = document.getElementById(`${square}`);
            if (squareElement) {
                const highlightedClassName = isSquareLight(square)
                    ? "highlighted-square-light"
                    : "highlighted-square-dark";

                squareElement.classList.remove(highlightedClassName);
            }
        }
    }

    function handleSquareHiglight(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();

        const squareId = (event.target as HTMLElement).id;

        const squareFile: number = getFile(squareId);
        const squareRank: number = getRank(squareId);

        const isSquareLight: boolean = (squareFile + squareRank) % 2 !== 0;
        const highlightedClassName: string = isSquareLight
            ? "highlighted-square-light"
            : "highlighted-square-dark";

        (event.target as HTMLElement).classList.add(highlightedClassName);
    }

    function handleOnDrop(droppedSquare: string | number) {
        if (!startingSquare) {
            return null;
        }

        setDraggedSquare(startingSquare);
        setDroppedSquare(droppedSquare);
    }

    function handleOnDrag(squareDragged: string | number) {
        setDraggedSquare(squareDragged);
    }

    function generateSquareHTML() {
        if (!pieceColor) {
            return null;
        }

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
            id={`${squareNumber}`}
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
