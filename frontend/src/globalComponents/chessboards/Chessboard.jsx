import { useState, useEffect, useContext, useRef } from "react";

import "../../styles/chessboard/chessboard.css";
import Square from "../Square.jsx";

import {
    clearSquaresStyling,
    getRank,
    getFile,
} from "../../utils/boardUtils.js";

import { playAudio } from "../../utils/audioUtils.js";

import {
    fetchLegalMoves,
    fetchMoveIsValid,
    getIsCheckmated,
    getIsStalemated,
} from "../../utils/apiUtils.js";

import {
    whitePromotionRank,
    blackPromotionRank,
} from "../../constants/boardSquares.js";

import {
    disableCastling,
    handleCastling,
    isCastling,
} from "../../utils/gameLogic/castling.js";

import { handleEnPassant, updateEnPassantTargetSquare } from "../../utils/gameLogic/enPassant.js";

import {
    GameEndedSetterContext,
    GameEndedCauseSetterContext,
    GameWinnerSetterContext,
} from "../../contexts/chessboardContexts.js";

import useAudio from "../../hooks/useAudio.js";

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

        const initialSquare = squareInfoToValidate["starting_square"];

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

            const initialSquare = oringinalBoardPlacements[`${draggedSquare}`]["starting_square"]

            let newPiecePlacements = {
                ...previousFENString,
                board_placement: {
                    ...previousFENString["board_placement"],
                    [`${droppedSquare}`]: {
                        piece_type: pieceType,
                        piece_color: pieceColor,
                        starting_square: initialSquare,
                    },
                },
            };

            delete newPiecePlacements["board_placement"][`${draggedSquare}`];

            if (pieceTypeToValidate.toLowerCase() === "pawn") {
                newPiecePlacements = handleEnPassant(newPiecePlacements, droppedSquare);
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
                const queensideRookSquares = [0, 56];

                const kingsideRookMoved = kingsideRookSquares.includes(parseInt(initialSquare));
                const sideToDisable = kingsideRookMoved ? "Kingside" : "Queenside"

                newPiecePlacements["castling_rights"] = disableCastling(
                    pieceColorToValidate,
                    newPiecePlacements["castling_rights"],
                    [sideToDisable]
                )
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

            (async () => {
                const kingColor =
                    pieceColorToValidate.toLowerCase() === "white"
                        ? "black"
                        : "white";

                const isCheckmated = await checkIsCheckmated(
                    newPiecePlacements,
                    kingColor
                );

                const isStalemated = await checkIsStalemated(
                    newPiecePlacements,
                    kingColor
                );

                if (isCheckmated || isStalemated) {
                    setGameEnded(true);

                    const gameEndedCause = isCheckmated
                        ? "checkmate"
                        : "stalemate";
                    const gameWinner = isCheckmated
                        ? pieceColorToValidate
                        : null;

                    setGameEndedCause(gameEndedCause);
                    setGameWinner(gameWinner);
                }
            })();

            console.log(newPiecePlacements);

            return newPiecePlacements;
        });

        const newSideToMove =
            sideToMove.toLowerCase() === "white" ? "black" : "white";

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
                if (isCastling(previousClickedSquare, clickedSquare)) {
                    const isKingside =
                        Number(previousClickedSquare) - Number(clickedSquare) === -2;
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

            (async () => {
                const boardPlacement = newPiecePlacements["board_placement"];
                const castlingRights = newPiecePlacements["castling_rights"];
                const kingColor =
                    pieceColorToValidate.toLowerCase() === "white"
                        ? "black"
                        : "white";

                const isCheckmated = await checkIsCheckmated(
                    newPiecePlacements,
                    kingColor
                );

                const isStalemated = await checkIsStalemated(
                    newPiecePlacements,
                    kingColor
                );

                if (isCheckmated || isStalemated) {
                    setGameEnded(true);

                    const gameEndedCause = isCheckmated
                        ? "checkmate"
                        : "stalemate";
                    const gameWinner = isCheckmated
                        ? pieceColorToValidate
                        : null;

                    setGameEndedCause(gameEndedCause);
                    setGameWinner(gameWinner);
                }
            })();

            return newPiecePlacements;
        });

        const newSideToMove =
            sideToMove.toLowerCase() === "white" ? "black" : "white";

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

            if (
                !Object.keys(previousFENString["board_placement"]).includes(
                    previousDroppedSquare
                )
            ) {
                return updatedBoardPlacement;
            }

            const squareInfo =
                previousFENString["board_placement"][previousDroppedSquare];

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
        selectingPromotionRef.current = false;
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

    async function checkIsCheckmated(currentFEN, kingColor) {
        const isCheckmated = await getIsCheckmated(currentFEN, kingColor);

        return isCheckmated;
    }

    async function checkIsStalemated(currentFEN, kingColor) {
        const isStalemated = await getIsStalemated(currentFEN, kingColor);

        return isStalemated;
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

        unpromotedBoardPlacementRef.current = parsedFENString;

        if (!(rank === promotionRank) || !(fileDifference === 1)) {
            if (rank === promotionRank) {
                if (autoQueen) {
                    handlePawnPromotion(pieceColor, "Queen", true);

                    return;
                }

                selectingPromotionRef.current = true;

                return;
            }

            return;
        }

        const boardPlacement = parsedFENString["board_placement"];
        const capturedPieceInfo = boardPlacement[`${destinationSquare}`];

        if (autoQueen) {
            handlePawnPromotion(pieceColor, "Queen", true);

            return;
        }

        selectingPromotionRef.current = true;

        setPromotionCapturedPiece(capturedPieceInfo);
    }

    function getPromotionStartingSquare(autoQueen) {
        return autoQueen ? draggedSquare : previousDraggedSquare;
    }

    function getPromotionEndingSquare(autoQueen) {
        return autoQueen ? droppedSquare : previousDroppedSquare;
    }

    async function handlePawnPromotion(color, promotedPiece, autoQueen) {
        console.log("Promoted pawn!")
        
        autoQueen = autoQueen || false;

        const promotionStartingSquare = getPromotionStartingSquare(autoQueen);
        const promotionEndingSquare = getPromotionEndingSquare(autoQueen);

        const [moveIsValid, moveType] = await fetchMoveIsValid(
            unpromotedBoardPlacementRef.current,
            color,
            "Pawn",
            promotionStartingSquare,
            promotionEndingSquare,
            {
                promoted_piece: promotedPiece,
            }
        );

        if (!moveIsValid) {
            return;
        }

        setParsedFENString((previousFENString) => ({
            ...previousFENString,
            board_placement: {
                ...previousFENString["board_placement"],
                [promotionEndingSquare]: {
                    piece_type: promotedPiece,
                    piece_color: color,
                },
            },
        }));

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

    

    function getBoardStartingIndex(row) {
        const whiteOrientationStartingIndex = (row - 1) * 8 + 1;
        const blackOrientationStartingIndex = row * 8;

        const isWhite = boardOrientation.toLowerCase() === "white";

        return isWhite
            ? whiteOrientationStartingIndex
            : blackOrientationStartingIndex;
    }

    function getBoardEndingIndex(row) {
        const whiteOrientationEndingIndex = row * 8;
        const blackOrientationEndingIndex = (row - 1) * 8 + 1;

        const isWhite = boardOrientation.toLowerCase() === "white";

        return isWhite
            ? whiteOrientationEndingIndex
            : blackOrientationEndingIndex;
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
            const startingIndex = getBoardStartingIndex(row);
            const endingIndex = getBoardEndingIndex(row);

            for (
                let square = startingIndex;
                boardOrientation.toLowerCase() === "white"
                    ? square <= endingIndex
                    : square >= endingIndex;
                boardOrientation.toLowerCase() === "white" ? square++ : square--
            ) {
                const file = getFile(square);

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
