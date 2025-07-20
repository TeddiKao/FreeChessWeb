import { useState, useEffect, useRef } from "react";

import {
    parseWebsocketUrl,
    isObjEmpty,
    isNullOrUndefined,
} from "@sharedUtils/generalUtils";
import usePieceAnimation from "@sharedHooks/usePieceAnimation";
import ChessboardGrid from "@sharedComponents/chessboard/ChessboardGrid";
import Square from "@sharedComponents/chessboard/Square";
import useWebsocketWithLifecycle from "@sharedHooks/websocket/useWebsocketWithLifecycle";
import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";
import { ParsedFEN, MoveInfo } from "@sharedTypes/chessTypes/gameState.types";
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

    handlePawnPromotion,
    cancelPromotion,
    promotionSquare,
    shouldShowPromotionPopup,
}: BotChessboardProps) {
    const [parsedFENString, setParsedFEN] =
        useState<OptionalValue<ParsedFEN>>(parsed_fen_string);

    const [previousDraggedSquare, setPreviousDraggedSquare] =
        useState<OptionalValue<ChessboardSquareIndex>>(lastDraggedSquare);
    const [previousDroppedSquare, setPreviousDroppedSquare] =
        useState<OptionalValue<ChessboardSquareIndex>>(lastDroppedSquare);

    const [pieceAnimationSquare, pieceAnimationStyles] = usePieceAnimation();

    const chessboardStyles = {
        gridTemplateColumns: `repeat(8, ${squareSize}px)`,
    };

    useEffect(() => {
        setParsedFEN(parsed_fen_string);
    }, [parsed_fen_string]);

    useEffect(() => {
        setPreviousDraggedSquare(lastDraggedSquare);
        setPreviousDroppedSquare(lastDroppedSquare);
    }, [lastDraggedSquare, lastDroppedSquare]);

    if (!parsedFENString) {
        return null;
    }

    if (!gameplaySettings) {
        return null;
    }

    const autoQueen = gameplaySettings["auto_queen"];

    function renderFilledSquare({
        squareIndex,
        squareColor,
        pieceType,
        pieceColor,
        promotionRank,
        pieceRank,
    }: FilledSquareRenderParams) {
        const isPromotionSquareDefined = !isNullOrUndefined(promotionSquare);
        const isPromotionSquare =
            Number(promotionSquare) === Number(squareIndex);
        const shouldDisplayPromotionPopup =
            isPromotionSquareDefined &&
            isPromotionSquare &&
            shouldShowPromotionPopup;

        return (
            <Square
                key={squareIndex}
                squareNumber={squareIndex}
                squareColor={squareColor}
                pieceColor={pieceColor as PieceColor}
                pieceType={pieceType as PieceType}
                displayPromotionPopup={shouldDisplayPromotionPopup}
                orientation={orientation}
                setParsedFEN={setParsedFEN}
                setDraggedSquare={setDraggedSquare}
                setDroppedSquare={setDroppedSquare}
                handlePromotionCancel={cancelPromotion}
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
        const isPromotionSquareDefined = !isNullOrUndefined(promotionSquare);
        const isPromotionSquare =
            Number(promotionSquare) === Number(squareIndex);
        const shouldDisplayPromotionPopup =
            isPromotionSquareDefined &&
            isPromotionSquare &&
            shouldShowPromotionPopup;

        return (
            <Square
                key={squareIndex}
                squareNumber={squareIndex}
                squareColor={squareColor}
                orientation={orientation}
                displayPromotionPopup={shouldDisplayPromotionPopup}
                setParsedFEN={setParsedFEN}
                setDraggedSquare={setDraggedSquare}
                setDroppedSquare={setDroppedSquare}
                setClickedSquare={setClickedSquare}
                setPrevClickedSquare={setPrevClickedSquare}
                handlePromotionCancel={cancelPromotion}
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
