import {
    isNullOrUndefined,
} from "@sharedUtils/generalUtils";
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
import { ChessboardSquareIndex } from "@/shared/types/chessTypes/board.types";
function BotChessboard({
    parsed_fen_string,
    orientation,
    gameplaySettings,
    squareSize,
    previousDraggedSquare,
    previousDroppedSquare,

    clickedSquaresState: {
        prevClickedSquare,
        clickedSquare,
        setPrevClickedSquare,
        setClickedSquare,
    },
    dragAndDropSquaresState: {
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
    const chessboardStyles = {
        gridTemplateColumns: `repeat(8, ${squareSize}px)`,
    };

    if (!parsed_fen_string) {
        return null;
    }

    if (!gameplaySettings) {
        return null;
    }

    function getShouldDisplayPromotionPopup(squareIndex: ChessboardSquareIndex) {
        const isPromotionSquareDefined = !isNullOrUndefined(promotionSquare);
        const isPromotionSquare =
            Number(promotionSquare) === Number(squareIndex);
        const shouldDisplayPromotionPopup =
            isPromotionSquareDefined &&
            isPromotionSquare &&
            shouldShowPromotionPopup;

        return shouldDisplayPromotionPopup;
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
                displayPromotionPopup={getShouldDisplayPromotionPopup(squareIndex)}
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
                animationRef={animationRef}
                animatingPieceSquare={animationSquare}
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
                displayPromotionPopup={getShouldDisplayPromotionPopup(squareIndex)}
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
                animationRef={animationRef}
                animatingPieceSquare={animationSquare}
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
