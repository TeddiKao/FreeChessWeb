import { useState, useEffect, useRef } from "react";


import { parseWebsocketUrl, isObjEmpty } from "@sharedUtils/generalUtils";
import usePieceAnimation from "@sharedHooks/usePieceAnimation";
import ChessboardGrid from "@sharedComponents/chessboard/ChessboardGrid";
import Square from "@sharedComponents/chessboard/Square";
import useWebsocketWithLifecycle from "@sharedHooks/websocket/useWebsocketWithLifecycle";
import { fetchLegalMoves } from "../../common/utils/moveService";
import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";
import { ParsedFEN, MoveInfo } from "@sharedTypes/chessTypes/gameState.types";
import { MoveMethods } from "@sharedTypes/chessTypes/moveMethods.enums";
import {
    PieceInfo,
    PieceColor,
    PieceType,
} from "@sharedTypes/chessTypes/pieces.types";
import { OptionalValue } from "@sharedTypes/utility.types";
import { BotChessboardProps } from "@gameplay/bot/types/botChessboardProps.types";
import {
    FilledSquareRenderParams,
    EmptySquareRenderParams,
} from "@sharedTypes/chessTypes/chessboardGrid.types";
function BotChessboard({
    parsed_fen_string,
    orientation,
    gameplaySettings,
    squareSize,
    gameId,
    lastDraggedSquare,
    lastDroppedSquare,

    parentAnimationSquare,
    parentAnimationStyles,

    clickedSquaresState: {
        prevClickedSquare,
        clickedSquare,
        setPrevClickedSquare,
        setClickedSquare,
    },
    dragAndDropSquaresState: {
        draggedSquare,
        droppedSquare,
        setDraggedSquare,
        setDroppedSquare,
    },
}: BotChessboardProps) {
    const [parsedFENString, setParsedFEN] =
        useState<OptionalValue<ParsedFEN>>(parsed_fen_string);

    const [previousDraggedSquare, setPreviousDraggedSquare] =
        useState<OptionalValue<ChessboardSquareIndex>>(lastDraggedSquare);
    const [previousDroppedSquare, setPreviousDroppedSquare] =
        useState<OptionalValue<ChessboardSquareIndex>>(lastDroppedSquare);
    const [promotionCapturedPiece, setPromotionCapturedPiece] =
        useState<OptionalValue<PieceInfo>>(null);

    const [pieceAnimationSquare, pieceAnimationStyles] =
        usePieceAnimation();

    const [sideToMove, setSideToMove] = useState<string>("white");

    const selectingPromotionRef = useRef<boolean>(false);
    const unpromotedBoardPlacementRef = useRef<OptionalValue<ParsedFEN>>(null);

    const chessboardStyles = {
        gridTemplateColumns: `repeat(8, ${squareSize}px)`,
    };

    const websocketURL = parseWebsocketUrl("bot-game-server", {
        gameId: gameId,
    });

    const { socketRef: botGameWebsocketRef } = useWebsocketWithLifecycle({
        url: websocketURL,
        enabled: true,
        onMessage: () => {}
    });

    useEffect(() => {
        setParsedFEN(parsed_fen_string);
    }, [parsed_fen_string]);

    useEffect(() => {
        setPreviousDraggedSquare(lastDraggedSquare);
        setPreviousDroppedSquare(lastDroppedSquare);
    }, [lastDraggedSquare, lastDroppedSquare]);

    async function displayLegalMoves(
        pieceType: string,
        pieceColor: string,
        startingSquare: ChessboardSquareIndex
    ) {
        if (!parsedFENString) {
            return;
        }

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

    function handleLegalMoveDisplay(moveMethod: string) {
        if (!parsedFENString) {
            return;
        }

        moveMethod = moveMethod.toLowerCase();

        const usingDrag = moveMethod === MoveMethods.DRAG;
        const startingSquare = usingDrag
            ? `${draggedSquare}`
            : `${prevClickedSquare}`;

        console.log(typeof startingSquare);

        if (!startingSquare) {
            return;
        }

        const boardPlacement = parsedFENString["board_placement"];
        const squareInfo = boardPlacement[`${startingSquare}`];
        const pieceType = squareInfo["piece_type"];
        const pieceColor = squareInfo["piece_color"];

        if (!showLegalMoves) {
            return;
        }

        displayLegalMoves(pieceType, pieceColor, startingSquare);
    }

    function handlePromotionCancel(color: PieceColor) {
        if (!previousDraggedSquare || !previousDroppedSquare) {
            return;
        }

        setParsedFEN((prevFENString: OptionalValue<ParsedFEN>) => {
            if (!prevFENString) {
                return parsedFENString;
            }

            const updatedBoardPlacement = cancelPromotion(
                prevFENString,
                color,
                previousDraggedSquare,
                previousDroppedSquare,
                promotionCapturedPiece || undefined
            );

            return updatedBoardPlacement;
        });

        setPromotionCapturedPiece(null);
        selectingPromotionRef.current = false;
    }

    function getPromotionStartingSquare(
        autoQueen: boolean,
        moveMethod: string
    ) {
        moveMethod = moveMethod.toLowerCase();

        if (moveMethod === MoveMethods.CLICK) {
            return autoQueen ? prevClickedSquare : previousDraggedSquare;
        } else if (moveMethod === MoveMethods.DRAG) {
            return autoQueen ? draggedSquare : previousDraggedSquare;
        }
    }

    function getPromotionEndingSquare(autoQueen: boolean, moveMethod: string) {
        moveMethod = moveMethod.toLowerCase();

        if (moveMethod === MoveMethods.CLICK) {
            return autoQueen ? clickedSquare : previousDroppedSquare;
        } else if (moveMethod === MoveMethods.DRAG) {
            return autoQueen ? droppedSquare : previousDroppedSquare;
        }
    }

    async function sendPromotionMove(
        moveInfo: MoveInfo,
        promotedPiece: PieceType
    ) {
        botGameWebsocketRef.current?.send(
            JSON.stringify({
                type: "move_made",
                move_info: {
                    ...moveInfo,
                    additional_info: {
                        promoted_piece: promotedPiece,
                    },
                },
            })
        );
    }

    async function handlePawnPromotion(
        color: PieceColor,
        promotedPiece: PieceType,
        moveMethod: string,
        autoQueen: boolean = false
    ) {
        console.log("Promotion function triggered!");

        if (!parsedFENString) {
            return;
        }

        const promotionStartingSquare = getPromotionStartingSquare(
            autoQueen,
            moveMethod
        );
        const promotionEndingSquare = getPromotionEndingSquare(
            autoQueen,
            moveMethod
        );

        if (!promotionStartingSquare || !promotionEndingSquare) {
            return;
        }

        if (!unpromotedBoardPlacementRef.current) {
            return;
        }

        console.log("Updating board placement");
        sendPromotionMove(
            {
                starting_square: promotionStartingSquare,
                destination_square: promotionEndingSquare,
                piece_color: color,
                piece_type: "pawn",
            },
            promotedPiece
        );
        selectingPromotionRef.current = false;

        const newSideToMove =
            sideToMove.toLowerCase() === "white" ? "black" : "white";

        setSideToMove(newSideToMove);

        setDraggedSquare(null);
        setDroppedSquare(null);
        setPrevClickedSquare(null);
        setClickedSquare(null);
        setPromotionCapturedPiece(null);
    }

    function renderFilledSquare({
        squareIndex,
        squareColor,
        pieceType,
        pieceColor,
        promotionRank,
        pieceRank,
    }: FilledSquareRenderParams) {
        return (
            <Square
                key={squareIndex}
                squareNumber={squareIndex}
                squareColor={squareColor}
                pieceColor={pieceColor as PieceColor}
                pieceType={pieceType as PieceType}
                displayPromotionPopup={
                    pieceType.toLowerCase() === "pawn" &&
                    promotionRank === pieceRank &&
                    !autoQueen
                }
                orientation={orientation}
                setParsedFEN={setParsedFEN}
                setDraggedSquare={setDraggedSquare}
                setDroppedSquare={setDroppedSquare}
                handlePromotionCancel={handlePromotionCancel}
                handlePawnPromotion={handlePawnPromotion}
				setPrevClickedSquare={setPrevClickedSquare}
				setClickedSquare={setClickedSquare}
                previousDraggedSquare={previousDraggedSquare}
                previousDroppedSquare={previousDroppedSquare}
                squareSize={squareSize}
				prevClickedSquare={prevClickedSquare}
				clickedSquare={clickedSquare}
				draggedSquare={draggedSquare}
				droppedSquare={droppedSquare}
                // @ts-ignore
                animatingPieceSquare={
                    pieceAnimationSquare || parentAnimationSquare
                }
                // @ts-ignore
                animatingPieceStyle={
                    // @ts-ignore
                    isObjEmpty(pieceAnimationStyles)
                        ? parentAnimationStyles
                        : pieceAnimationStyles
                }
            />
        );
    }

    function renderEmptySquare({
        squareIndex,
        squareColor,
    }: EmptySquareRenderParams) {
        return (
            <Square
                key={squareIndex}
                squareNumber={squareIndex}
                squareColor={squareColor}
                orientation={orientation}
                displayPromotionPopup={false}
                setParsedFEN={setParsedFEN}
                setDraggedSquare={setDraggedSquare}
                setDroppedSquare={setDroppedSquare}
				setClickedSquare={setClickedSquare}
				setPrevClickedSquare={setPrevClickedSquare}
                handlePromotionCancel={handlePromotionCancel}
                handlePawnPromotion={handlePawnPromotion}
                previousDraggedSquare={previousDraggedSquare}
                previousDroppedSquare={previousDroppedSquare}
                squareSize={squareSize}
				prevClickedSquare={prevClickedSquare}
				clickedSquare={clickedSquare}
				draggedSquare={draggedSquare}
				droppedSquare={droppedSquare}
                // @ts-ignore
                animatingPieceSquare={
                    pieceAnimationSquare || parentAnimationSquare
                }
                // @ts-ignore
                animatingPieceStyle={
                    // @ts-ignore
                    isObjEmpty(pieceAnimationStyles)
                        ? parentAnimationStyles
                        : pieceAnimationStyles
                }
            />
        );
    }

    return (
        <>
            <ChessboardGrid
                renderFilledSquare={renderFilledSquare}
                renderEmptySquare={renderEmptySquare}
                boardOrientation={orientation}
                boardPlacement={parsedFENString["board_placement"]}
                chessboardStyles={chessboardStyles}
            />
        </>
    );
}

export default BotChessboard;
