import { useState, useEffect } from "react";

import "../styles/chessboard.css";
import Square from "./Square";

import { clearSquaresStyling, getRank, getFile } from "../utils/boardUtils.js";
import {
    fetchLegalMoves,
    fetchMoveIsValid,
    getIsCheckmated,
    getIsStalemated,
} from "../utils/apiUtils.js";
import { capitaliseFirstLetter } from "../utils/generalUtils.js";
import {
    whitePromotionRank,
    blackPromotionRank,
} from "../constants/boardSquares.js";

import {
    whiteKingsideCastlingSquare,
    blackKingsideCastlingSquare,
    whiteQueensideCastlingSquare,
    blackQueensideCastlingSquare,
    whiteKingStartingSquare,
    blackKingStartingSquare,
} from "../constants/castlingSquares.js";

function Chessboard({ parsed_fen_string, orientation }) {
    const [previousClickedSquare, setPreviousClickedSquare] = useState(null);
    const [clickedSquare, setClickedSquare] = useState(null);
    const [parsedFENString, setParsedFENString] = useState(parsed_fen_string);

    const [draggedSquare, setDraggedSquare] = useState(null);
    const [droppedSquare, setDroppedSquare] = useState(null);

    const [previousDraggedSquare, setPreviousDraggedSquare] = useState(null);
    const [previousDroppedSquare, setPreviousDroppedSquare] = useState(null);
    const [promotionCapturedPiece, setPromotionCapturedPiece] = useState(null);

    const [gameEnded, setGameEnded] = useState(false);
    const [gameEndedCause, setGameEndedCause] = useState(null);
    const [gameWinner, setGameWinner] = useState(null);

    const [boardOrientation, setBoardOrientation] = useState(orientation);

    useEffect(() => {
        setParsedFENString(parsed_fen_string);
    }, [parsed_fen_string]);

    useEffect(() => {
        handleClickToMove();
    }, [previousClickedSquare, clickedSquare]);

    useEffect(() => {
        handleOnDrop();
    }, [draggedSquare, droppedSquare]);

    async function handleOnDrop() {
        clearSquaresStyling();

        if (!(draggedSquare && droppedSquare)) {
            if (!draggedSquare) {
                return;
            }

            const boardPlacement = parsedFENString["board_placement"];
            const squareInfo = boardPlacement[`${draggedSquare}`];
            const pieceType = squareInfo["piece_type"];
            const pieceColor = squareInfo["piece_color"];

            displayLegalMoves(pieceType, pieceColor, draggedSquare);

            return;
        }

        if (draggedSquare === droppedSquare) {
            setDraggedSquare(null);
            setDroppedSquare(null);

            return;
        }

        const boardPlacementToValidate = parsedFENString["board_placement"];
        const squareInfoToValidate =
            boardPlacementToValidate[`${draggedSquare}`];

        const pieceTypeToValidate = squareInfoToValidate["piece_type"];
        const pieceColorToValidate = squareInfoToValidate["piece_color"];

        const moveIsLegal = await fetchMoveIsValid(
            parsedFENString,
            pieceColorToValidate,
            pieceTypeToValidate,
            draggedSquare,
            droppedSquare
        );

        if (!moveIsLegal) {
            setDraggedSquare(null);
            setDroppedSquare(null);
            return;
        }

        if (pieceTypeToValidate.toLowerCase() === "pawn") {
            handlePromotionCapture(
                pieceColorToValidate,
                draggedSquare,
                droppedSquare
            );
        }

        setParsedFENString((previousFENString) => {
            const oringinalBoardPlacements =
                previousFENString["board_placement"];

            const pieceType =
                oringinalBoardPlacements[`${draggedSquare}`]["piece_type"];
            const pieceColor =
                oringinalBoardPlacements[`${draggedSquare}`]["piece_color"];

            let newPiecePlacements = {
                ...previousFENString,
                board_placement: {
                    ...previousFENString["board_placement"],
                    [`${droppedSquare}`]: {
                        piece_type: pieceType,
                        piece_color: pieceColor,
                    },
                },
            };

            delete newPiecePlacements["board_placement"][`${draggedSquare}`];

            console.log("Board has been updated!");

            if (pieceTypeToValidate.toLowerCase() === "rook") {
                const kingsideRookSquares = [7, 63];
                const queensideRookSquares = [0, 56];

                if (kingsideRookSquares.includes(parseInt(initialSquare))) {
                    newPiecePlacements = modifyCastlingRights(
                        newPiecePlacements,
                        pieceColorToValidate,
                        "Kingside"
                    );
                }

                if (queensideRookSquares.includes(parseInt(initialSquare))) {
                    newPiecePlacements = modifyCastlingRights(
                        newPiecePlacements,
                        pieceColorToValidate,
                        "Queenside"
                    );
                }
            }

            const colorCastlingRights =
                previousFENString["castling_rights"][pieceColor];

            const queensideColorCastlingRights =
                colorCastlingRights["Queenside"];
            const kingsideColorCastlingRights = colorCastlingRights["Kingside"];

            if (pieceTypeToValidate.toLowerCase() === "king") {
                if (
                    parseInt(droppedSquare) === whiteKingsideCastlingSquare ||
                    parseInt(droppedSquare) === blackKingsideCastlingSquare
                ) {
                    if (kingsideColorCastlingRights) {
                        if (
                            parseInt(droppedSquare) - 2 ===
                            parseInt(draggedSquare)
                        ) {
                            const moveInfo = {
                                starting_square: draggedSquare,
                                destination_square: droppedSquare,
                            };

                            newPiecePlacements = handleKingsideCastling(
                                newPiecePlacements,
                                previousFENString["castling_rights"],
                                pieceColor,
                                moveInfo
                            );
                        }
                    }
                }

                console.log("Checked queenside");

                if (
                    parseInt(droppedSquare) === whiteQueensideCastlingSquare &&
                    parseInt(droppedSquare) === blackQueensideCastlingSquare
                ) {
                    if (queensideColorCastlingRights) {
                        if (
                            parseInt(droppedSquare) + 2 ===
                            parseInt(draggedSquare)
                        ) {
                            newPiecePlacements = handleCastling(
                                newPiecePlacements,
                                "queenside",
                                pieceColorToValidate
                            );
                        }
                    }
                }

                newPiecePlacements = disableCastlingForColor(
                    newPiecePlacements,
                    pieceColorToValidate
                );
            }

            (async () => {
                const boardPlacement = newPiecePlacements["board_placement"];
                const castlingRights = newPiecePlacements["castling_rights"];
                const kingColor =
                    pieceColorToValidate.toLowerCase() === "white"
                        ? "black"
                        : "white";

                const isCheckmated = await checkIsCheckmated(
                    newPiecePlacements["board_placement"],
                    newPiecePlacements["castling_rights"],
                    kingColor
                );

                const isStalemated = await checkIsStalemated(
                    newPiecePlacements["board_placement"],
                    newPiecePlacements["castling_rights"],
                    kingColor
                );

                console.log(isCheckmated);
                console.log(isStalemated);

                if (isCheckmated) {
                    console.log("Checkmate!");
                }

                if (isStalemated) {
                    console.log("Stalemate!");
                }
            })();

            return newPiecePlacements;
        });

        setPreviousDraggedSquare(draggedSquare);
        setPreviousDroppedSquare(droppedSquare);
        setDraggedSquare(null);
        setDroppedSquare(null);
    }

    async function handleClickToMove() {
        clearSquaresStyling();

        if (!(previousClickedSquare && clickedSquare)) {
            if (!previousClickedSquare) {
                return;
            }

            const boardPlacement = parsedFENString["board_placement"];

            if (
                !Object.keys(boardPlacement).includes(
                    `${previousClickedSquare}`
                )
            ) {
                return;
            }

            const squareInfo = boardPlacement[`${previousClickedSquare}`];

            const pieceType = squareInfo["piece_type"];
            const pieceColor = squareInfo["piece_color"];
            const currentSquare = `${previousClickedSquare}`;

            displayLegalMoves(pieceType, pieceColor, currentSquare);

            return;
        }

        if (previousClickedSquare === clickedSquare) {
            setPreviousClickedSquare(null);
            setClickedSquare(null);

            return;
        }

        if (
            !Object.keys(parsedFENString["board_placement"]).includes(
                previousClickedSquare
            )
        ) {
            setPreviousClickedSquare(null);
            setClickedSquare(null);

            return;
        }

        const boardPlacement = parsedFENString["board_placement"];
        const initialSquare =
            boardPlacement[`${previousClickedSquare}`]["initial_square"];
        const pieceTypeToValidate =
            boardPlacement[`${previousClickedSquare}`]["piece_type"];
        const pieceColorToValidate =
            boardPlacement[`${previousClickedSquare}`]["piece_color"];

        const isMoveLegal = await fetchMoveIsValid(
            parsedFENString,
            pieceColorToValidate,
            pieceTypeToValidate,
            previousClickedSquare,
            clickedSquare
        );

        if (!isMoveLegal) {
            return;
        }

        if (pieceTypeToValidate.toLowerCase() === "pawn") {
            handlePromotionCapture(
                pieceColorToValidate,
                previousClickedSquare,
                clickedSquare
            );
        }

        setParsedFENString((previousFENString) => {
            const oringinalBoardPlacements =
                previousFENString["board_placement"];

            const pieceType =
                oringinalBoardPlacements[`${previousClickedSquare}`][
                    "piece_type"
                ];
            const pieceColor =
                oringinalBoardPlacements[`${previousClickedSquare}`][
                    "piece_color"
                ];

            let newPiecePlacements = {
                ...previousFENString,
                board_placement: {
                    ...previousFENString["board_placement"],
                    [`${clickedSquare}`]: {
                        piece_type: pieceType,
                        piece_color: pieceColor,
                    },
                },
            };

            delete newPiecePlacements["board_placement"][
                `${previousClickedSquare}`
            ];

            if (pieceTypeToValidate.toLowerCase() === "rook") {
                const kingsideRookSquares = [7, 63];
                const queensideRookSquares = [0, 56];

                if (kingsideRookSquares.includes(parseInt(initialSquare))) {
                    newPiecePlacements = modifyCastlingRights(
                        newPiecePlacements,
                        pieceColorToValidate,
                        "Kingside"
                    );
                }

                if (queensideRookSquares.includes(parseInt(initialSquare))) {
                    newPiecePlacements = modifyCastlingRights(
                        newPiecePlacements,
                        pieceColorToValidate,
                        "Queenside"
                    );
                }
            }

            const colorCastlingRights =
                previousFENString["castling_rights"][pieceColor];

            const queensideColorCastlingRights =
                colorCastlingRights["Queenside"];
            const kingsideColorCastlingRights = colorCastlingRights["Kingside"];

            if (pieceTypeToValidate.toLowerCase() === "king") {
                if (
                    parseInt(clickedSquare) === whiteKingsideCastlingSquare ||
                    parseInt(clickedSquare) === blackKingsideCastlingSquare
                ) {
                    if (kingsideColorCastlingRights) {
                        if (
                            parseInt(clickedSquare) - 2 ===
                            parseInt(previousClickedSquare)
                        ) {
                            const moveInfo = {
                                starting_square: previousClickedSquare,
                                destination_square: clickedSquare,
                            };

                            newPiecePlacements = handleKingsideCastling(
                                newPiecePlacements,
                                previousFENString["castling_rights"],
                                pieceColor,
                                moveInfo
                            );
                        }
                    }
                }

                if (
                    parseInt(clickedSquare) === whiteQueensideCastlingSquare &&
                    parseInt(clickedSquare) === blackQueensideCastlingSquare
                ) {
                    if (queensideColorCastlingRights) {
                        if (
                            parseInt(clickedSquare) + 2 ===
                            parseInt(previousClickedSquare)
                        ) {
                            newPiecePlacements = handleCastling(
                                newPiecePlacements,
                                "queenside",
                                pieceColorToValidate
                            );
                        }
                    }
                }

                newPiecePlacements = disableCastlingForColor(
                    newPiecePlacements,
                    pieceColorToValidate
                );

                const kingColor =
                    pieceColorToValidate.toLowerCase() === "white"
                        ? "black"
                        : "white";

                const isCheckmated = checkIsCheckmated(
                    newPiecePlacements["board_placement"],
                    newPiecePlacements["castling_rights"],
                    kingColor
                );
            }

            return newPiecePlacements;
        });

        setPreviousDraggedSquare(previousClickedSquare);
        setPreviousDroppedSquare(clickedSquare);
        setPreviousClickedSquare(null);
        setClickedSquare(null);
    }

    async function displayLegalMoves(pieceType, pieceColor, startingSquare) {
        const legalMoves = await fetchLegalMoves(
            parsedFENString,
            pieceType,
            pieceColor,
            startingSquare
        );

        if (!legalMoves) {
            return;
        }

        for (const legalMove of legalMoves) {
            const square = document.getElementById(legalMove);
            if (square) {
                square.classList.add("legal-square");
            }
        }
    }

    if (!parsedFENString) {
        return null;
    }

    const piecePlacements = parsedFENString["board_placement"];

    function handleSquareClick(event, square) {
        const container = document.getElementById(square);
        event.target = container;

        if (!previousClickedSquare && !clickedSquare) {
            setPreviousClickedSquare(event.target.id);
        } else {
            setClickedSquare(event.target.id);
        }
    }

    function handlePromotionCancel(color) {
        setParsedFENString((previousFENString) => {
            let updatedBoardPlacement = {
                ...previousFENString,
                board_placement: {
                    ...previousFENString["board_placement"],
                    [previousDraggedSquare]: {
                        piece_type: "Pawn",
                        piece_color: color,
                    },
                },
            };

            delete updatedBoardPlacement["board_placement"][
                previousDroppedSquare
            ];

            console.log(previousFENString["board_placement"]);

            if (
                !Object.keys(previousFENString["board_placement"]).includes(
                    previousDroppedSquare
                )
            ) {
                return updatedBoardPlacement;
            }

            const squareInfo =
                previousFENString["board_placement"][previousDroppedSquare];
            console.log(squareInfo, color);

            if (!promotionCapturedPiece) {
                return updatedBoardPlacement;
            }

            if (
                promotionCapturedPiece["piece_color"].toLowerCase() ===
                color.toLowerCase()
            ) {
                return updatedBoardPlacement;
            }

            updatedBoardPlacement = {
                ...updatedBoardPlacement,
                board_placement: {
                    ...updatedBoardPlacement["board_placement"],
                    [previousDroppedSquare]: promotionCapturedPiece,
                },
            };

            return updatedBoardPlacement;
        });

        setPromotionCapturedPiece(null);
        console.log(parsedFENString);
    }

    function handleKingsideCastling(
        originalPiecePlacements,
        castlingRights,
        color,
        moveInfo
    ) {
        console.log(castlingRights);

        const colorCastlingRights = castlingRights[color];
        const startingSquare = moveInfo["starting_square"];
        const destinationSquare = moveInfo["destination_square"];

        if (!colorCastlingRights["Kingside"]) {
            return originalPiecePlacements;
        }

        if (parseInt(startingSquare) + 2 !== parseInt(destinationSquare)) {
            return originalPiecePlacements;
        }

        console.log("Changing piece placements");

        const newPiecePlacements = handleCastling(
            originalPiecePlacements,
            "kingside",
            color
        );

        return newPiecePlacements;
    }

    function modifyCastlingRights(originalFENString, color, castlingSide) {
        const updatedFENString = {
            ...originalFENString,
            castling_rights: {
                ...originalFENString["castling_rights"],
                [color]: {
                    ...originalFENString["castling_rights"][color],
                    [castlingSide]: false,
                },
            },
        };

        return updatedFENString;
    }

    function handleCastling(originalFENString, castlingSide, color) {
        const castlingSquareOffset =
            castlingSide.toLowerCase() === "queenside" ? -2 : 2;

        const startingSquare =
            color.toLowerCase() === "white"
                ? whiteKingStartingSquare
                : blackKingStartingSquare;

        const originalRookSquare =
            castlingSide.toLowerCase() === "queenside"
                ? startingSquare - 4
                : startingSquare + 3;

        const castledRookSquare =
            castlingSide.toLowerCase() === "queenside"
                ? startingSquare - 1
                : startingSquare + 1;

        const newFENString = {
            ...originalFENString,
            board_placement: {
                ...originalFENString["board_placement"],
                [`${castledRookSquare}`]: {
                    piece_type: "Rook",
                    piece_color: color,
                    starting_square: `${startingSquare}`,
                },
            },
        };

        delete newFENString["board_placement"][`${originalRookSquare}`];
        console.log(originalRookSquare);

        return newFENString;
    }

    async function checkIsCheckmated(
        boardPlacement,
        castlingRights,
        kingColor
    ) {
        const isCheckmated = await getIsCheckmated(
            boardPlacement,
            castlingRights,
            kingColor
        );

        return isCheckmated;
    }

    async function checkIsStalemated(
        boardPlacement,
        castlingRights,
        kingColor
    ) {
        const isStalemated = await getIsStalemated(
            boardPlacement,
            castlingRights,
            kingColor
        );

        return isStalemated;
    }

    function disableCastlingForColor(originalFENString, color) {
        return {
            ...originalFENString,
            castling_rights: {
                ...originalFENString["castling_rights"],
                [color]: {
                    Kingside: false,
                    Queenside: false,
                },
            },
        };
    }

    function handlePromotionCapture(
        pieceColor,
        startSquare,
        destinationSquare
    ) {
        const rank = getRank(destinationSquare);
        const startFile = getFile(startSquare);
        const endFile = getFile(destinationSquare);
        const fileDifference = Math.abs(startFile - endFile);

        const promotionRank =
            pieceColor.toLowerCase() === "white"
                ? whitePromotionRank
                : blackPromotionRank;

        if (!(rank === promotionRank) || !(fileDifference === 1)) {
            return;
        }

        const boardPlacement = parsedFENString["board_placement"];
        const capturedPieceInfo = boardPlacement[`${destinationSquare}`];

        setPromotionCapturedPiece(capturedPieceInfo);
    }

    function handlePawnPromotion(color, promotedPiece) {
        setParsedFENString((previousFENString) => ({
            ...previousFENString,
            board_placement: {
                ...previousFENString["board_placement"],
                [previousDroppedSquare]: {
                    piece_type: promotedPiece,
                    piece_color: color,
                },
            },
        }));

        setDraggedSquare(null);
        setDroppedSquare(null);
        setPreviousClickedSquare(null);
        setClickedSquare(null);
        setPromotionCapturedPiece(null);
    }

    function generateChessboard() {
        const squareElements = [];

        const startingRow = orientation === "White" ? 8 : 1;
        const endingRow = orientation === "White" ? 1 : 8;

        for (
            let row = startingRow;
            orientation === "White" ? row >= endingRow : row <= endingRow;
            orientation === "White" ? row-- : row++
        ) {
            const startingIndex = (row - 1) * 8 + 1;
            const endingIndex = row * 8;

            for (let square = startingIndex; square <= endingIndex; square++) {
                const file = square - startingIndex + 1;

                const squareIsLight = (file + row) % 2 !== 0;
                const squareColor = squareIsLight ? "light" : "dark";

                const boardPlacementSquare = `${square - 1}`;
                if (
                    Object.keys(piecePlacements).includes(boardPlacementSquare)
                ) {
                    const pieceColor =
                        piecePlacements[boardPlacementSquare]["piece_color"];
                    const pieceType =
                        piecePlacements[boardPlacementSquare]["piece_type"];

                    const promotionRank =
                        pieceColor.toLowerCase() === "white" ? 7 : 0;
                    const pieceRank = getRank(boardPlacementSquare);

                    squareElements.push(
                        <Square
                            key={boardPlacementSquare}
                            squareNumber={boardPlacementSquare}
                            squareColor={squareColor}
                            pieceColor={pieceColor}
                            pieceType={pieceType}
                            displayPromotionPopup={
                                pieceType.toLowerCase() === "pawn" &&
                                promotionRank === pieceRank
                            }
                            handleSquareClick={handleSquareClick}
                            setParsedFENString={setParsedFENString}
                            setDraggedSquare={setDraggedSquare}
                            setDroppedSquare={setDroppedSquare}
                            handlePromotionCancel={handlePromotionCancel}
                            handlePawnPromotion={handlePawnPromotion}
                            previousDraggedSquare={previousDraggedSquare}
                            previousDroppedSquare={previousDroppedSquare}
                        />
                    );
                } else {
                    squareElements.push(
                        <Square
                            key={boardPlacementSquare}
                            squareNumber={boardPlacementSquare}
                            squareColor={squareColor}
                            handleSquareClick={handleSquareClick}
                            displayPromotionPopup={false}
                            setParsedFENString={setParsedFENString}
                            setDraggedSquare={setDraggedSquare}
                            setDroppedSquare={setDroppedSquare}
                            handlePromotionCancel={handlePromotionCancel}
                            handlePawnPromotion={handlePawnPromotion}
                            previousDraggedSquare={previousDraggedSquare}
                            previousDroppedSquare={previousDroppedSquare}
                        />
                    );
                }
            }
        }

        return squareElements;
    }

    return <div className="chessboard-container">{generateChessboard()}</div>;
}

export default Chessboard;
