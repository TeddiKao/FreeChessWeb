import useWebsocketLifecycle from "@/shared/hooks/websocket/useWebsocketLifecycle";
import useClickedSquaresState from "../../multiplayer/hooks/useClickedSquaresState";
import useDraggedSquaresState from "../../multiplayer/hooks/useDraggedSquaresState";
import useWebsocketWithLifecycle from "@/shared/hooks/websocket/useWebsocketWithLifecycle";
import { parseWebsocketUrl } from "@/shared/utils/generalUtils";

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
    };
}

export default useBotGameplayLogic;
