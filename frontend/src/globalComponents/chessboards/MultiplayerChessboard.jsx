import { useState, useEffect, useContext, useRef } from "react";

import "../../styles/chessboard/chessboard.css";
import Square from "../Square.jsx";

import {
    clearSquaresStyling,
    getRank,
    getFile,
} from "../../utils/boardUtils.js";
import {
    fetchLegalMoves,
    fetchMoveIsValid,
} from "../../utils/apiUtils.js";

import {
    whitePromotionRank,
    blackPromotionRank,
} from "../../constants/boardSquares.js";

import {
    GameEndedSetterContext,
    GameEndedCauseSetterContext,
    GameWinnerSetterContext,
} from "../../contexts/chessboardContexts.js";

import { websocketBaseURL } from "../../constants/urls.js";
import useWebSocket from "../../hooks/useWebsocket.js";
import { getAccessToken } from "../../utils/tokenUtils.js";

import useAudio from "../../hooks/useAudio.js";

import _ from "lodash";

function MultiplayerChessboard({ parsed_fen_string, orientation, gameId }) {
    const [previousClickedSquare, setPreviousClickedSquare] = useState(null);
    const [clickedSquare, setClickedSquare] = useState(null);
    const [parsedFENString, setParsedFENString] = useState(parsed_fen_string);

    const [draggedSquare, setDraggedSquare] = useState(null);
    const [droppedSquare, setDroppedSquare] = useState(null);

    const [previousDraggedSquare, setPreviousDraggedSquare] = useState(null);
    const [previousDroppedSquare, setPreviousDroppedSquare] = useState(null);
    const [promotionCapturedPiece, setPromotionCapturedPiece] = useState(null);

    const [boardOrientation, setBoardOrientation] = useState(orientation);

    const setGameEnded = useContext(GameEndedSetterContext);
    const setGameEndedCause = useContext(GameEndedCauseSetterContext);
    const setGameWinner = useContext(GameWinnerSetterContext);

    const [gameWebsocketConnected, setGameWebsocketConnected] = useState(true);

    const gameWebsocket = useRef(null);

    const moveAudio = useAudio("/move-self.mp3");
    const captureAudio = useAudio("/capture.mp3");
    const checkAudio = useAudio("/move-check.mp3");
    const promoteAudio = useAudio("/promote.mp3");
    const castlingAudio = useAudio("/castle.mp3");

    useEffect(() => {
        setParsedFENString(parsed_fen_string);
    }, [parsed_fen_string]);

    useEffect(() => {
        setBoardOrientation(orientation);
    }, [orientation]);

    useEffect(() => {
        handleClickToMove();
    }, [previousClickedSquare, clickedSquare]);

    useEffect(() => {
        const gameWebsocketURL = `${websocketBaseURL}ws/game-server/?token=${getAccessToken()}&gameId=${gameId}`;
        const websocket = useWebSocket(
            gameWebsocketURL,
            handleOnMessage,
            onError
        );

        gameWebsocket.current = websocket;

        return () => {
            if (gameWebsocket.current?.readyState === WebSocket.OPEN) {
                gameWebsocket.current?.close();
            }
        };
    }, []);

    useEffect(() => {
        handleOnDrop();
    }, [draggedSquare, droppedSquare]);

    useEffect(() => {
        if (!gameWebsocketConnected) {
            gameWebsocket.current?.close();
        }
    }, [gameWebsocketConnected]);

    function handleOnMessage(event) {
        const parsedEventData = JSON.parse(event.data);

        if (parsedEventData["type"] === "move_made") {
            makeMove(parsedEventData);
        }
    }

    function makeMove(eventData) {
        setParsedFENString((prevState) => {
            return {
                ...prevState,
                ...eventData["new_parsed_fen"],
            };
        });

        const startingSquare = eventData["move_data"]["starting_square"];
        const destinationSquare = eventData["move_data"]["destination_square"];

        playSound(eventData["move_type"])

        setPreviousDraggedSquare(startingSquare);
        setPreviousDroppedSquare(destinationSquare);
    }

    function onError() {
        console.log("Error!");
    }

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
            console.log("Trying to handle promotion");

            const isPromotion = handlePromotionCapture(
                pieceColorToValidate,
                draggedSquare,
                droppedSquare
            );

            console.log(isPromotion);

            if (isPromotion) {
                setParsedFENString((prevFENString) => {
                    let newPiecePlacements = structuredClone(prevFENString);

                    newPiecePlacements = {
                        ...newPiecePlacements,
                        board_placement: {
                            ...newPiecePlacements["board_placement"],
                            [`${droppedSquare}`]: {
                                piece_type: "Pawn",
                                piece_color: pieceColorToValidate,
                            },
                        },
                    };

                    delete newPiecePlacements["board_placement"][
                        `${draggedSquare}`
                    ];

                    return newPiecePlacements;
                });

                setPreviousDraggedSquare(draggedSquare);
                setPreviousDroppedSquare(droppedSquare);
                setDraggedSquare(null);
                setDroppedSquare(null);

                return;
            }
        }

        if (gameWebsocket.current?.readyState === WebSocket.OPEN) {
            const moveDetails = {
                piece_color: pieceColorToValidate,
                piece_type: pieceTypeToValidate,
                starting_square: draggedSquare,
                initial_square: initialSquare,
                destination_square: droppedSquare,

                additional_info: {},
            };

            gameWebsocket.current?.send(JSON.stringify(moveDetails));
        }

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
            console.log("Trying to handle promotion");

            const isPromotion = handlePromotionCapture(
                pieceColorToValidate,
                previousClickedSquare,
                clickedSquare
            );

            if (isPromotion) {
                return;
            }
        }

        if (gameWebsocket.current?.readyState === WebSocket.OPEN) {
            const moveDetails = {
                piece_color: pieceColorToValidate,
                piece_type: pieceTypeToValidate,
                starting_square: previousClickedSquare,
                destination_square: clickedSquare,

                move_type: "regular",
            };

            gameWebsocket.current?.send(JSON.stringify(moveDetails));
        }

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
    }

    function playSound(moveType) {
        switch (moveType.toLowerCase()) {
            case "move":
                moveAudio.play()
                break;

            case "capture":
                captureAudio.play()
                break;

            case "castling":
                castlingAudio.play()
                break;

            case "promotion":
                promoteAudio.play()
                break;

            case "check":
                checkAudio.play()
                break;

            case "no sound":
                break;

            default:
                console.error(`Invalid move type: ${moveType}`);
        }
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

        console.log(`File difference: ${fileDifference}`);

        const promotionRank =
            pieceColor.toLowerCase() === "white"
                ? whitePromotionRank
                : blackPromotionRank;

        if (!(rank === promotionRank) || !(fileDifference === 1)) {
            if (rank === promotionRank && fileDifference === 0) {
                return true;
            }

            return;
        }

        const boardPlacement = parsedFENString["board_placement"];
        const capturedPieceInfo = boardPlacement[`${destinationSquare}`];

        setPromotionCapturedPiece(capturedPieceInfo);

        return true;
    }

    function handlePawnPromotion(color, promotedPiece) {
        console.log(previousDraggedSquare, previousDroppedSquare);

        const moveDetails = {
            piece_color: color,
            piece_type: "Pawn",
            starting_square: previousDraggedSquare,
            destination_square: previousDroppedSquare,

            additional_info: {
                promoted_piece: promotedPiece,
            }
        };

        gameWebsocket?.current?.send(JSON.stringify(moveDetails))

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
            const whiteOrientationStartingIndex = (row - 1) * 8 + 1;
            const whiteOrientationEndingIndex = row * 8;

            const blackOrientationStartingIndex = row * 8;
            const blackOrientationEndingIndex = (row - 1) * 8 + 1;

            const startingIndex =
                boardOrientation.toLowerCase() === "white"
                    ? whiteOrientationStartingIndex
                    : blackOrientationStartingIndex;
            const endingIndex =
                boardOrientation.toLowerCase() === "white"
                    ? whiteOrientationEndingIndex
                    : blackOrientationEndingIndex;

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
                            orientation={boardOrientation}
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
                            orientation={boardOrientation}
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

export default MultiplayerChessboard;
