import useClickedSquaresState from "../../multiplayer/hooks/useClickedSquaresState";
import useDraggedSquaresState from "../../multiplayer/hooks/useDraggedSquaresState";
import { useEffect } from "react";
import { displayLegalMoves } from "../../common/utils/moveService";
import { isPawnPromotion } from "../../common/utils/moveTypeDetection";
import { clearSquaresStyling, getRank } from "@/shared/utils/boardUtils";
import usePromotionLogic from "../../multiplayer/hooks/usePromotionLogic";
import { PieceColor, PieceType } from "@/shared/types/chessTypes/pieces.types";
import { ChessboardSquareIndex } from "@/shared/types/chessTypes/board.types";
import useAnimationLogic from "../../multiplayer/hooks/useAnimationLogic";
import useBotPositionList from "./useBotPositionList";
import useBotGameplayWebsocket from "./useBotGameplayWebsocket";
import useBotMoveList from "./useBotMoveList";
import useBotGameEndState from "./useBotGameEndState";

interface BotGameplayLogicHookProps {
    gameId: number;
    orientation: PieceColor;
}

function useBotGameplayLogic({
    gameId,
    orientation,
}: BotGameplayLogicHookProps) {
    const {
        positionList,
        positionIndex,
        parsedFEN,
        previousDraggedSquare,
        previousDroppedSquare,
        setPositionIndex,
        setPositionList,
    } = useBotPositionList(gameId);

    const { moveList, setMoveList } = useBotMoveList(gameId);

    const {
        clickedSquare,
        setClickedSquare,
        prevClickedSquare,
        setPrevClickedSquare,
    } = useClickedSquaresState();

    const { draggedSquare, setDraggedSquare, droppedSquare, setDroppedSquare } =
        useDraggedSquaresState();

    const {
        gameWinner,
        hasGameEnded,
        gameEndedCause,
        handleDraw,
        handleCheckmate,
        setHasGameEnded,
        setGameEndedCause,
        setGameWinner,
    } = useBotGameEndState();

    const { sendMessage } = useBotGameplayWebsocket({
        gameId: gameId,
        functionCallbacks: {
            handleCheckmate,
            handleDraw,
            handlePlayerMoveMade,
            handleBotMoveMade,
        },
    });

    const {
        preparePromotion,
        handlePawnPromotion,
        cancelPromotion,
        prePromotionBoardState,
        performPostPromotionCleanup,
        originalPawnSquareRef,
        promotionSquareRef,
        shouldShowPromotionPopup,
    } = usePromotionLogic(parsedFEN);

    const { animationRef, animationSquare, prepareAnimationData } =
        useAnimationLogic(orientation);

    useEffect(() => {
        processMove("click");
    }, [prevClickedSquare, clickedSquare]);

    useEffect(() => {
        processMove("drag");
    }, [draggedSquare, droppedSquare]);

    async function processMove(moveMethod: "click" | "drag") {
        clearSquaresStyling();

        const usingDrag = moveMethod === "drag";

        const startingSquare = usingDrag ? draggedSquare : prevClickedSquare;
        const destinationSquare = usingDrag ? droppedSquare : clickedSquare;

        if (!parsedFEN) return;
        if (!startingSquare) return;

        if (startingSquare && !destinationSquare) {
            displayLegalMoves(parsedFEN, startingSquare);
            return;
        }

        if (startingSquare === destinationSquare) return;

        const boardPlacement = parsedFEN["board_placement"];
        const squareInfo = boardPlacement[startingSquare.toString()];
        const pieceType = squareInfo["piece_type"];
        const pieceColor = squareInfo["piece_color"];

        if (pieceType.toLowerCase() === "pawn") {
            if (
                isPawnPromotion(
                    pieceColor,
                    getRank(destinationSquare?.toString()!)
                )
            ) {
                console.log("Pawn promotion detected");

                preparePromotion(startingSquare, destinationSquare!);
                handlePawnPromotion(sendPromotionMove);
                performPostMoveCleanup(moveMethod);

                return;
            }
        }

        const moveInfo = {
            piece_type: pieceType,
            piece_color: pieceColor,
            starting_square: startingSquare.toString(),
            destination_square: destinationSquare?.toString(),

            additional_info: {},
        };

        sendMessage({
            type: "move_made",
            move_info: moveInfo,
        });

        performPostMoveCleanup(moveMethod);
    }

    function sendPromotionMove(
        originalPawnSquare: ChessboardSquareIndex,
        promotionSquare: ChessboardSquareIndex,
        promotedPiece: PieceType
    ) {
        if (!parsedFEN) return;

        const boardPlacement = parsedFEN["board_placement"];
        const squareInfo = boardPlacement[originalPawnSquare.toString()];
        const pieceType = squareInfo["piece_type"];
        const pieceColor = squareInfo["piece_color"];

        const moveInfo = {
            piece_type: pieceType,
            piece_color: pieceColor,
            starting_square: originalPawnSquare.toString(),
            destination_square: promotionSquare?.toString(),

            additional_info: {
                promoted_piece: promotedPiece,
            },
        };

        sendMessage({
            type: "move_made",
            move_info: moveInfo,
        });

        performPostPromotionCleanup();
    }

    function performPostMoveCleanup(moveMethod: string) {
        if (moveMethod === "drag") {
            setDraggedSquare(null);
            setDroppedSquare(null);
        } else {
            setPrevClickedSquare(null);
            setClickedSquare(null);
        }
    }

    function handlePlayerMoveMade({
        new_position_list: newPositionList,
        new_move_list: newMoveList,
        move_data: moveData,
    }: any) {
        const startingSquare = moveData["starting_square"];
        const destinationSquare = moveData["destination_square"];

        prepareAnimationData(startingSquare, destinationSquare, () => {
            setPositionList(newPositionList);
            setPositionIndex(newPositionList.length - 1);
            setMoveList(newMoveList);
        });
    }

    function handleBotMoveMade({
        new_position_list: newPositionList,
        new_move_list: newMoveList,
        move_data: moveData,
    }: any) {
        const startingSquare = moveData["starting_square"];
        const destinationSquare = moveData["destination_square"];

        prepareAnimationData(startingSquare, destinationSquare, () => {
            setPositionList(newPositionList);
            setPositionIndex(newPositionList.length - 1);
            setMoveList(newMoveList);
        });
    }

    return {
        clickedSquare,
        setClickedSquare,
        prevClickedSquare,
        setPrevClickedSquare,
        draggedSquare,
        setDraggedSquare,
        droppedSquare,
        setDroppedSquare,

        gameStateHistory: {
            positionList,
            setPositionList,
            positionIndex,
            setPositionIndex,

            moveList,
            setMoveList,
        },

        parsedFEN,
        previousDraggedSquare,
        previousDroppedSquare,

        hasGameEnded,
        setHasGameEnded,
        gameWinner,
        setGameWinner,
        gameEndedCause,
        setGameEndedCause,

        handleCheckmate,
        handleDraw,

        cancelPromotion,
        prePromotionBoardState: prePromotionBoardState.current,

        handlePromotionPieceSelected: (
            _: PieceColor,
            promotedPiece: PieceType
        ) => {
            if (!promotionSquareRef.current) return;
            if (!originalPawnSquareRef.current) return;

            sendPromotionMove(
                originalPawnSquareRef.current,
                promotionSquareRef.current,
                promotedPiece
            );
        },

        promotionSquare: promotionSquareRef.current,
        shouldShowPromotionPopup,

        animationRef,
        animationSquare,
        prepareAnimationData,
    };
}

export default useBotGameplayLogic;
