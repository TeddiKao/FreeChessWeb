import useWebsocketLifecycle from "@/shared/hooks/websocket/useWebsocketLifecycle";
import useClickedSquaresState from "../../multiplayer/hooks/useClickedSquaresState";
import useDraggedSquaresState from "../../multiplayer/hooks/useDraggedSquaresState";
import useWebsocketWithLifecycle from "@/shared/hooks/websocket/useWebsocketWithLifecycle";
import { parseWebsocketUrl } from "@/shared/utils/generalUtils";
import { useEffect, useState } from "react";
import { MoveList, PositionList } from "@/shared/types/chessTypes/gameState.types";
import { fetchBotGameMoveList, fetchBotGamePositionList } from "../botGameApiService";
import { BotGameWebSocketEventTypes } from "../botGameEvents.enums";
import { displayLegalMoves } from "../../common/utils/moveService";
import { isPawnPromotion } from "../../common/utils/moveTypeDetection";
import { clearSquaresStyling, getRank } from "@/shared/utils/boardUtils";

interface BotGameplayLogicHookProps {
    gameId: number;
}

function useBotGameplayLogic({ gameId }: BotGameplayLogicHookProps) {
    const websocketUrl = parseWebsocketUrl("bot-game-server", {
        gameId: gameId,
    })
    const { socketRef } = useWebsocketWithLifecycle({
        url: websocketUrl,
        enabled: true,
        onMessage: handleOnMessage
    });

    const [positionList, setPositionList] = useState<PositionList>([]);
    const [positionIndex, setPositionIndex] = useState<number>(0);

    const parsedFEN = positionList[positionIndex]?.["position"];
    const previousDraggedSquare = positionList[positionIndex]?.["last_dragged_square"];;
    const previousDroppedSquare = positionList[positionIndex]?.["last_dropped_square"];

    const [moveList, setMoveList] = useState<MoveList>([]);

    const {
        clickedSquare,
        setClickedSquare,
        prevClickedSquare,
        setPrevClickedSquare,
    } = useClickedSquaresState();

    const { draggedSquare, setDraggedSquare, droppedSquare, setDroppedSquare } =
        useDraggedSquaresState();

    const [gameWinner, setGameWinner] = useState<string>("");
    const [hasGameEnded, setHasGameEnded] = useState(false);
    const [gameEndedCause, setGameEndedCause] = useState<string>("");

    useEffect(() => {
        updatePositionList();
        updateMoveList();
    }, []);

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

        console.log(startingSquare, destinationSquare);

        const boardPlacement = parsedFEN["board_placement"];
        const squareInfo = boardPlacement[startingSquare.toString()];
        const pieceType = squareInfo["piece_type"];
        const pieceColor = squareInfo["piece_color"];

        console.log(typeof(destinationSquare));

        if (pieceType.toLowerCase() === "pawn") {
            if (isPawnPromotion(pieceColor, getRank(destinationSquare?.toString()!))) {
                // TODO: Implement pawn promotion logic
                return;
            }
        }

        const moveInfo = {
            piece_type: pieceType,
            piece_color: pieceColor,
            starting_square: startingSquare.toString(),
            destination_square: destinationSquare.toString(),

            additional_info: {}
        };

        socketRef?.current?.send(JSON.stringify({
            type: "move_made",
            move_info: moveInfo,
        }))

        performPostMoveCleanup(moveMethod);
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

    async function updatePositionList() {
        const positionList = await fetchBotGamePositionList(gameId);

        setPositionList(positionList);
        setPositionIndex(positionList.length - 1);
    }

    async function updateMoveList() {
        const moveList = await fetchBotGameMoveList(gameId);

        setMoveList(moveList);
    }

    function handleOnMessage(event: MessageEvent) {
        const parsedEventData = JSON.parse(event.data);
        const eventType = parsedEventData["type"];

        switch (eventType) {
            case BotGameWebSocketEventTypes.CHECKMATE_OCCURRED:
                handleCheckmate(parsedEventData);
                break;

            case BotGameWebSocketEventTypes.STALEMATE_OCCURRED:
                handleDraw("stalemate");
                break;

            case BotGameWebSocketEventTypes.THREEFOLD_REPETITION_OCCURRED:
                handleDraw("repetition");
                break;

            case BotGameWebSocketEventTypes.FIFTY_MOVE_RULE_REACHED:
                handleDraw("50-move rule");
                break;

            case BotGameWebSocketEventTypes.MOVE_REGISTERED:
                handlePlayerMoveMade(parsedEventData);
                break;

            case BotGameWebSocketEventTypes.BOT_MOVE_MADE:
                handleBotMoveMade(parsedEventData);
                break;
        }
    }

    function handleCheckmate({ game_winner: gameWinner }: any) {
        setHasGameEnded(true);
        setGameWinner(gameWinner);
        setGameEndedCause("checkmate");
    }

    function handleDraw(drawCause: string) {
        setHasGameEnded(true);
        setGameEndedCause(drawCause);
    }

    function handlePlayerMoveMade({
        new_position_list: newPositionList,
        new_move_list: newMoveList,
        move_data: moveData,
    }: any) {
        setPositionList(newPositionList);
        setPositionIndex(newPositionList.length - 1);
        setMoveList(newMoveList);
    }

    function handleBotMoveMade({
        new_position_list: newPositionList,
        new_move_list: newMoveList,
    }: any) {
        setPositionList(newPositionList);
        setPositionIndex(newPositionList.length - 1);
        setMoveList(newMoveList);
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
    };
}

export default useBotGameplayLogic;
