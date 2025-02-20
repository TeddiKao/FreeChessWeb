import { useState, useEffect, useContext, useRef } from "react";

import "../../styles/chessboard/chessboard.css";
import Square from "../Square.jsx";

import {
    clearSquaresStyling,
    getRank,
    getFile,
    getBoardStartingIndex,
    getBoardEndingIndex,
    isSquareLight,
    getSquareExists,
} from "../../utils/boardUtils.js";

import { playAudio } from "../../utils/audioUtils.js";

import {
    fetchLegalMoves,
    fetchMoveIsValid,
    getIsCheckmated,
    getIsStalemated,
} from "../../utils/apiUtils.js";

import {
    disableCastling,
    handleCastling,
    isCastling,
} from "../../utils/gameLogic/castling.js";

import {
    handleEnPassant,
    updateEnPassantTargetSquare,
} from "../../utils/gameLogic/enPassant.js";

import {
    GameEndedSetterContext,
    GameEndedCauseSetterContext,
    GameWinnerSetterContext,
} from "../../contexts/chessboardContexts.js";

import { PieceColor, PieceType } from "../../enums/pieces.js";
import {
    cancelPromotion,
    handlePromotionCaptureStorage,
    updatePromotedBoardPlacment,
} from "../../utils/gameLogic/promotion.js";
import {
    addPieceToDestinationSquare,
    clearStartingSquare,
} from "../../utils/gameLogic/basicMovement.js";
import { MoveMethods } from "../../enums/gameLogic.js";
import { getOppositeColor } from "../../utils/gameLogic/general.js";
function Chessboard({
    parsed_fen_string,
    boardOrientation,
    setBoardOrientation,
    flipOnMove,
    gameplaySettings,
}) {
    const [previousClickedSquare, setPreviousClickedSquare] = useState(null);
    const [clickedSquare, setClickedSquare] = useState(null);
    const [parsedFENString, setParsedFENString] = useState(parsed_fen_string);

    const [draggedSquare, setDraggedSquare] = useState(null);
    const [droppedSquare, setDroppedSquare] = useState(null);

    const [previousDraggedSquare, setPreviousDraggedSquare] = useState(null);
    const [previousDroppedSquare, setPreviousDroppedSquare] = useState(null);
    const [promotionCapturedPiece, setPromotionCapturedPiece] = useState(null);

    const [sideToMove, setSideToMove] = useState("white");

    const setGameEnded = useContext(GameEndedSetterContext);
    const setGameEndedCause = useContext(GameEndedCauseSetterContext);
    const setGameWinner = useContext(GameWinnerSetterContext);

    const isFirstRender = useRef(false);
    const selectingPromotionRef = useRef(false);
    const unpromotedBoardPlacementRef = useRef(null);

    useEffect(() => {
        setParsedFENString(parsed_fen_string);
    }, [parsed_fen_string]);

    useEffect(() => {
        handleClickToMove();
    }, [previousClickedSquare, clickedSquare]);

    useEffect(() => {
        handleOnDrop();
    }, [draggedSquare, droppedSquare]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (flipOnMove) {
            setBoardOrientation(sideToMove.toLowerCase());
        }
    }, [sideToMove]);

    async function handleOnDrop() {
        clearSquaresStyling();

        if (!(draggedSquare && droppedSquare)) {
            if (!draggedSquare) {
                return;
            }

            handleLegalMoveDisplay("drag");

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

        const [moveIsLegal, moveType] = await fetchMoveIsValid(
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

        if (pieceTypeToValidate.toLowerCase() === PieceType.PAWN) {
            handlePromotionCaptureStorage(
                parsedFENString,
                pieceColorToValidate,
                draggedSquare,
                droppedSquare,
                setPromotionCapturedPiece,
                selectingPromotionRef,
                unpromotedBoardPlacementRef,
                handlePawnPromotion,
                gameplaySettings
            );
        }

        setParsedFENString((previousFENString) => {
            const oringinalBoardPlacements =
                previousFENString["board_placement"];

            const pieceType =
                oringinalBoardPlacements[`${draggedSquare}`]["piece_type"];
            const pieceColor =
                oringinalBoardPlacements[`${draggedSquare}`]["piece_color"];

            const initialSquare =
                oringinalBoardPlacements[`${draggedSquare}`]["starting_square"];

            let newPiecePlacements = addPieceToDestinationSquare(
                previousFENString,
                droppedSquare,
                {
                    piece_type: pieceType,
                    piece_color: pieceColor,
                    starting_square: initialSquare,
                }
            );

            newPiecePlacements = clearStartingSquare(
                newPiecePlacements,
                draggedSquare
            );

            if (pieceTypeToValidate.toLowerCase() === PieceType.PAWN) {
                newPiecePlacements = handleEnPassant(
                    newPiecePlacements,
                    droppedSquare
                );
            }

            const enPassantMoveInfo = {
                startingSquare: draggedSquare,
                destinationSquare: droppedSquare,
                pieceType: pieceTypeToValidate,
                pieceColor: pieceColorToValidate,
            };

            newPiecePlacements = updateEnPassantTargetSquare(
                newPiecePlacements,
                enPassantMoveInfo
            );

            if (pieceTypeToValidate.toLowerCase() === "rook") {
                const kingsideRookSquares = [7, 63];

                const kingsideRookMoved = kingsideRookSquares.includes(
                    parseInt(initialSquare)
                );
                const sideToDisable = kingsideRookMoved
                    ? "Kingside"
                    : "Queenside";

                newPiecePlacements["castling_rights"] = disableCastling(
                    pieceColorToValidate,
                    newPiecePlacements["castling_rights"],
                    [sideToDisable]
                );
            }

            if (pieceTypeToValidate.toLowerCase() === "king") {
                if (isCastling(draggedSquare, droppedSquare)) {
                    const isKingside =
                        Number(draggedSquare) - Number(droppedSquare) === -2;
                    const castlingSide = isKingside ? "Kingside" : "Queenside";

                    newPiecePlacements = handleCastling(
                        previousFENString,
                        pieceColorToValidate,
                        castlingSide
                    );
                }

                const originalCastlingRights = structuredClone(
                    newPiecePlacements["castling_rights"]
                );

                const newCastlingRights = disableCastling(
                    pieceColorToValidate,
                    originalCastlingRights,
                    ["Kingside", "Queenside"]
                );

                newPiecePlacements["castling_rights"] = newCastlingRights;
            }

            handleGameEndDetection(newPiecePlacements, pieceColorToValidate);

            return newPiecePlacements;
        });

        const newSideToMove = getOppositeColor(pieceColorToValidate);

        if (!selectingPromotionRef.current) {
            setSideToMove(newSideToMove);
        }

        playAudio(moveType);

        setPreviousDraggedSquare(draggedSquare);
        setPreviousDroppedSquare(droppedSquare);
        setDraggedSquare(null);
        setDroppedSquare(null);
    }

    async function handleClickToMove() {
        const boardPlacement = parsedFENString["board_placement"];

        clearSquaresStyling();

        if (!getSquareExists(previousClickedSquare, boardPlacement)) {
            return;
        }

        const shouldMove = previousClickedSquare && clickedSquare;
        if (!shouldMove) {
            if (previousClickedSquare) {
                handleLegalMoveDisplay("click");
            }

            return;
        }

        if (previousClickedSquare === clickedSquare) {
            setPreviousClickedSquare(null);
            setClickedSquare(null);

            return;
        }

        const initialSquare =
            boardPlacement[`${previousClickedSquare}`]["starting_square"];
        const pieceTypeToValidate =
            boardPlacement[`${previousClickedSquare}`]["piece_type"];
        const pieceColorToValidate =
            boardPlacement[`${previousClickedSquare}`]["piece_color"];

        const [isMoveLegal, moveType] = await fetchMoveIsValid(
            parsedFENString,
            pieceColorToValidate,
            pieceTypeToValidate,
            previousClickedSquare,
            clickedSquare
        );

        if (!isMoveLegal) {
            return;
        }

        if (pieceTypeToValidate.toLowerCase() === PieceType.PAWN) {
            handlePromotionCaptureStorage(
                parsedFENString,
                pieceColorToValidate,
                previousClickedSquare,
                clickedSquare,
                setPromotionCapturedPiece,
                selectingPromotionRef,
                unpromotedBoardPlacementRef,
                handlePawnPromotion,
                gameplaySettings
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

            let newPiecePlacements = addPieceToDestinationSquare(
                previousFENString,
                clickedSquare,
                {
                    piece_type: pieceType,
                    piece_color: pieceColor,
                    starting_square: initialSquare,
                }
            );

            newPiecePlacements = clearStartingSquare(
                newPiecePlacements,
                previousClickedSquare
            );

            if (pieceTypeToValidate.toLowerCase() === PieceType.PAWN) {
                newPiecePlacements = handleEnPassant(
                    newPiecePlacements,
                    clickedSquare
                );
            }

            const enPassantMoveInfo = {
                startingSquare: previousClickedSquare,
                destinationSquare: clickedSquare,
                pieceType: pieceTypeToValidate,
                pieceColor: pieceColorToValidate,
            };

            newPiecePlacements = updateEnPassantTargetSquare(
                newPiecePlacements,
                enPassantMoveInfo
            );

            if (pieceTypeToValidate.toLowerCase() === PieceType.ROOK) {
                const kingsideRookSquares = [7, 63];

                const kingsideRookMoved = kingsideRookSquares.includes(
                    parseInt(initialSquare)
                );

                const sideToDisable = kingsideRookMoved
                    ? "Kingside"
                    : "Queenside";

                newPiecePlacements["castling_rights"] = disableCastling(
                    pieceColorToValidate,
                    newPiecePlacements["castling_rights"],
                    [sideToDisable]
                );
            }

            if (pieceTypeToValidate.toLowerCase() === "king") {
                if (isCastling(previousClickedSquare, clickedSquare)) {
                    const isKingside =
                        Number(previousClickedSquare) -
                            Number(clickedSquare) ===
                        -2;
                    const castlingSide = isKingside ? "Kingside" : "Queenside";

                    newPiecePlacements = handleCastling(
                        previousFENString,
                        pieceColorToValidate,
                        castlingSide
                    );
                }

                const originalCastlingRights = structuredClone(
                    newPiecePlacements["castling_rights"]
                );

                const newCastlingRights = disableCastling(
                    pieceColorToValidate,
                    originalCastlingRights,
                    ["Kingside", "Queenside"]
                );

                newPiecePlacements["castling_rights"] = newCastlingRights;
            }

            handleGameEndDetection(newPiecePlacements, pieceColorToValidate);

            return newPiecePlacements;
        });

        const newSideToMove = getOppositeColor(pieceColorToValidate);

        setSideToMove(newSideToMove);

        playAudio(moveType);

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

    if (!gameplaySettings) {
        return null;
    }

    const autoQueen = gameplaySettings["auto_queen"];
    const showLegalMoves = gameplaySettings["show_legal_moves"];

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

    function handleLegalMoveDisplay(moveMethod) {
        moveMethod = moveMethod.toLowerCase();

        const usingDrag = moveMethod === MoveMethods.DRAG;
        const startingSquare = usingDrag
            ? draggedSquare
            : previousClickedSquare;

        const boardPlacement = parsedFENString["board_placement"];
        const squareInfo = boardPlacement[`${startingSquare}`];
        const pieceType = squareInfo["piece_type"];
        const pieceColor = squareInfo["piece_color"];

        if (!showLegalMoves) {
            return;
        }

        displayLegalMoves(pieceType, pieceColor, draggedSquare);
    }

    function handlePromotionCancel(color) {
        setParsedFENString((prevFENString) => {
            const updatedBoardPlacement = cancelPromotion(
                prevFENString,
                color,
                previousDraggedSquare,
                previousDroppedSquare,
                promotionCapturedPiece
            );

            return updatedBoardPlacement;
        });

        setPromotionCapturedPiece(null);
        selectingPromotionRef.current = false;
    }

    async function handleGameEndDetection(fenString, color) {
        const kingColor = getOppositeColor(color);

        const isCheckmated = await checkIsCheckmated(fenString, kingColor);
        const isStalemated = await checkIsStalemated(fenString, kingColor);

        const gameEnded = isCheckmated || isStalemated;
        if (gameEnded) {
            handleGameEnded(isCheckmated, color);
        }
    }

    function handleGameEnded(isCheckmated, color) {
        setGameEnded(true);

        const gameEndedCause = isCheckmated ? "checkmate" : "stalemate";
        const gameWinner = isCheckmated ? color : null;

        setGameEndedCause(gameEndedCause);
        setGameWinner(gameWinner);
    }

    async function checkIsCheckmated(currentFEN, kingColor) {
        const isCheckmated = await getIsCheckmated(currentFEN, kingColor);

        return isCheckmated;
    }

    async function checkIsStalemated(currentFEN, kingColor) {
        const isStalemated = await getIsStalemated(currentFEN, kingColor);

        return isStalemated;
    }

    function getPromotionStartingSquare(autoQueen, moveMethod) {
        moveMethod = moveMethod.toLowerCase();

        if (moveMethod === MoveMethods.CLICK) {
            return autoQueen ? previousClickedSquare : previousDraggedSquare;
        } else if (moveMethod === MoveMethods.DRAG) {
            return autoQueen ? draggedSquare : previousDraggedSquare;
        }
    }

    function getPromotionEndingSquare(autoQueen, moveMethod) {
        moveMethod = moveMethod.toLowerCase();

        if (moveMethod === MoveMethods.CLICK) {
            return autoQueen ? clickedSquare: previousDroppedSquare;
        } else if (moveMethod === MoveMethods.DRAG) {
            return autoQueen ? droppedSquare : previousDroppedSquare;
        }
    }

    async function handlePawnPromotion(color, promotedPiece, autoQueen) {
        autoQueen = autoQueen || false;

        const promotionStartingSquare = getPromotionStartingSquare(autoQueen);
        const promotionEndingSquare = getPromotionEndingSquare(autoQueen);

        const [updatedBoardPlacement, moveType] =
            await updatePromotedBoardPlacment(
                parsedFENString,
                color,
                promotedPiece,
                autoQueen,
                promotionStartingSquare,
                promotionEndingSquare,
                unpromotedBoardPlacementRef
            );

        setParsedFENString(updatedBoardPlacement);

        playAudio(moveType);
        selectingPromotionRef.current = false;

        const newSideToMove =
            sideToMove.toLowerCase() === "white" ? "black" : "white";

        setSideToMove(newSideToMove);

        setDraggedSquare(null);
        setDroppedSquare(null);
        setPreviousClickedSquare(null);
        setClickedSquare(null);
        setPromotionCapturedPiece(null);
    }

    function generateChessboard() {
        const squareElements = [];

        const startingRow = boardOrientation.toLowerCase() === "white" ? 8 : 1;
        const endingRow = boardOrientation.toLowerCase() === "white" ? 1 : 8;

        for (
            let row = startingRow;
            boardOrientation.toLowerCase() === "white"
                ? row >= endingRow
                : row <= endingRow;
            boardOrientation.toLowerCase() === "white" ? row-- : row++
        ) {
            const startingIndex = getBoardStartingIndex(row, boardOrientation);
            const endingIndex = getBoardEndingIndex(row, boardOrientation);

            for (
                let square = startingIndex;
                boardOrientation.toLowerCase() === "white"
                    ? square <= endingIndex
                    : square >= endingIndex;
                boardOrientation.toLowerCase() === "white" ? square++ : square--
            ) {
                const squareIsLight = isSquareLight(square - 1);
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
                                promotionRank === pieceRank &&
                                !autoQueen
                            }
                            orientation={boardOrientation}
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
                            orientation={boardOrientation}
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

    return (
        <>
            <div className="chessboard-container">{generateChessboard()}</div>
        </>
    );
}

export default Chessboard;
