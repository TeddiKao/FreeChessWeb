import useWebsocketLifecycle from "@/shared/hooks/websocket/useWebsocketLifecycle";
import useClickedSquaresState from "../../multiplayer/hooks/useClickedSquaresState";
import useDraggedSquaresState from "../../multiplayer/hooks/useDraggedSquaresState";
import useWebsocketWithLifecycle from "@/shared/hooks/websocket/useWebsocketWithLifecycle";
import { parseWebsocketUrl } from "@/shared/utils/generalUtils";
import { useState } from "react";
import { MoveList, PositionList } from "@/shared/types/chessTypes/gameState.types";

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

    function handleOnMessage() {

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
    };
}

export default useBotGameplayLogic;
