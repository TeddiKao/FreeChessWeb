import useWebsocketWithLifecycle from "@/shared/hooks/websocket/useWebsocketWithLifecycle";
import { parseWebsocketUrl } from "@/shared/utils/generalUtils";

function useBotGameplayWebsocket({
    gameId,
    handleOnMessage,
}: {
    gameId: number;
    handleOnMessage: (event: MessageEvent) => void;
}) {
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

    return { sendMessage };
}

export default useBotGameplayWebsocket;
