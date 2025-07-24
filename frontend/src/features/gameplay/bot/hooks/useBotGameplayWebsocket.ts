import useWebsocketWithLifecycle from "@/shared/hooks/websocket/useWebsocketWithLifecycle";
import { parseWebsocketUrl } from "@/shared/utils/generalUtils";
import { BotCheckmateEventData } from "../types/botGameEvents.types";
import { BotGameWebSocketEventTypes } from "../types/botGameEvents.enums";

interface BotGameplayWebsocketHookProps {
    gameId: number;
    functionCallbacks: {
        handleCheckmate: (data: BotCheckmateEventData) => void;
        handleDraw: (drawCause: string) => void;
        handlePlayerMoveMade: (data: any) => void;
        handleBotMoveMade: (data: any) => void;
    };
}

function useBotGameplayWebsocket({
    gameId,
    functionCallbacks: {
        handleCheckmate,
        handleDraw,
        handlePlayerMoveMade,
        handleBotMoveMade,
    },
}: BotGameplayWebsocketHookProps) {
    const websocketUrl = parseWebsocketUrl("bot-game-server", {
        gameId: gameId,
    });

    const { socketRef } = useWebsocketWithLifecycle({
        url: websocketUrl,
        enabled: true,
        onMessage: handleOnMessage,
    });

    function sendMessage(messageContent: any) {
        socketRef?.current?.send(JSON.stringify(messageContent));
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

    return { sendMessage };
}

export default useBotGameplayWebsocket;
