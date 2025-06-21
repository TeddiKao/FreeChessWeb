import { websocketBaseURL } from "../constants/urls";
import { getAccessToken } from "../utils/tokenUtils";
import useWebsocketWithLifecycle from "./useWebsocketWithLifecycle";

interface MultiplayerGameplayWebsocketHookProps {
	handleMoveMade: () => void;
	handleMoveListUpdate: () => void;
	handlePositionListUpdate: () => void;
	handleCheckmate: () => void;
	handleDraw: () => void;
	handlePlayerTimeout: () => void;
	handleTimerChanged: () => void;
}

function useMultiplayerGameplayWebsocket({
	handleMoveMade,
    handlePositionListUpdate,
    handleMoveListUpdate,
    handleCheckmate,
    handlePlayerTimeout,
    handleTimerChanged,
    handleDraw
}: MultiplayerGameplayWebsocketHookProps) {
	const gameWebsocketUrl = `${websocketBaseURL}/ws/game-server/?token=${getAccessToken()}&gameId=${gameId}`;
	const { socketRef: gameWebsocketRef } = useWebsocketWithLifecycle({
		url: gameWebsocketUrl,
		onMessage: handleOnMessage,
		enabled: true,
	});
}

export default useMultiplayerGameplayWebsocket;
