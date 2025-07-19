import useWebsocketLifecycle from "@/shared/hooks/websocket/useWebsocketLifecycle";
import useClickedSquaresState from "../../multiplayer/hooks/useClickedSquaresState";
import useDraggedSquaresState from "../../multiplayer/hooks/useDraggedSquaresState";
import useWebsocketWithLifecycle from "@/shared/hooks/websocket/useWebsocketWithLifecycle";
import { parseWebsocketUrl } from "@/shared/utils/generalUtils";
import { useEffect, useState } from "react";
import { MoveList, PositionList } from "@/shared/types/chessTypes/gameState.types";
import { fetchBotGameMoveList, fetchBotGamePositionList } from "../botGameApiService";
import { BotGameWebSocketEventTypes } from "../botGameEvents.enums";

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

    function handleCheckmate({ game_winner: gameWinner }: any) {
        setHasGameEnded(true);
        setGameWinner(gameWinner);
        setGameEndedCause("checkmate");
    }

    function handleDraw(drawCause: string) {
        setHasGameEnded(true);
        setGameEndedCause(drawCause);
    }

    useEffect(() => {
        updatePositionList();
        updateMoveList();
    }, []);

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

            default:
                console.error(`Invalid event type ${eventType}`);
        }
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
