import {
    isObjEmpty,
    isNullOrUndefined,
} from "@sharedUtils/generalUtils";
import usePieceAnimation from "@sharedHooks/usePieceAnimation";
import ChessboardGrid from "@sharedComponents/chessboard/ChessboardGrid";
import Square from "@sharedComponents/chessboard/Square";
import {
    PieceColor,
    PieceType,
} from "@sharedTypes/chessTypes/pieces.types";
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
    previousDraggedSquare,
    previousDroppedSquare,

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
    animationRef,
    animationSquare
}: BotChessboardProps) {
    const [pieceAnimationSquare, pieceAnimationStyles] = usePieceAnimation();

    const chessboardStyles = {
        gridTemplateColumns: `repeat(8, ${squareSize}px)`,
    };

    if (!parsed_fen_string) {
        return null;
    }

    if (!gameplaySettings) {
        return null;
    }

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
                animationRef={animationRef}
                animationSquare={animationSquare}
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
                animationRef={animationRef}
                animationSquare={animationSquare}
            />
        );
    }

    return (
        <>
            <ChessboardGrid
                renderFilledSquare={renderFilledSquare}
                renderEmptySquare={renderEmptySquare}
                boardOrientation={orientation}
                boardPlacement={parsed_fen_string["board_placement"]}
                chessboardStyles={chessboardStyles}
            />
        </>
    );
}

export default BotChessboard;
