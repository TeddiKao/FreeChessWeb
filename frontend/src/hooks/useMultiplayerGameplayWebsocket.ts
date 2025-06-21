import { websocketBaseURL } from "../constants/urls";
import { GameplayWebSocketEventTypes } from "../enums/gameLogic";
import { CheckmateEventData, MoveListUpdateEventData, MoveMadeEventData, PositionListUpdateEventData, TimerChangedEventData } from "../interfaces/gameLogic";
import { getAccessToken } from "../utils/tokenUtils";
import useWebsocketWithLifecycle from "./useWebsocketWithLifecycle";

interface MultiplayerGameplayWebsocketHookProps {
    gameId: number;
	handleMoveMade: (eventData: MoveMadeEventData) => void;
	handleMoveListUpdated: (eventData: MoveListUpdateEventData) => void;
	handlePositionListUpdated: (eventData: PositionListUpdateEventData) => void;
	handleCheckmate: (eventData: CheckmateEventData) => void;
	handleDraw: (drawCause: string) => void;
	handlePlayerTimeout: (eventData: any) => void;
	handleTimerChanged: (eventData: TimerChangedEventData) => void;
}

function useMultiplayerGameplayWebsocket({
    gameId,
	handleMoveMade,
	handlePositionListUpdated,
	handleMoveListUpdated,
	handleCheckmate,
	handlePlayerTimeout,
	handleTimerChanged,
	handleDraw,
}: MultiplayerGameplayWebsocketHookProps) {
	const gameWebsocketUrl = `${websocketBaseURL}/ws/game-server/?token=${getAccessToken()}&gameId=${gameId}`;
	const { socketRef: gameWebsocketRef } = useWebsocketWithLifecycle({
		url: gameWebsocketUrl,
		onMessage: handleOnMessage,
		enabled: true,
	});

	function handleOnMessage(event: MessageEvent) {
		const eventData = JSON.parse(event.data);
		const eventType = eventData["type"];

		switch (eventType) {
			case GameplayWebSocketEventTypes.MOVE_MADE:
				handleMoveMade(eventData);
				break;

			case GameplayWebSocketEventTypes.TIMER_DECREMENTED:
			case GameplayWebSocketEventTypes.TIMER_INCREMENTED:
				handleTimerChanged(eventData);
				break;

			case GameplayWebSocketEventTypes.POSITION_LIST_UPDATED:
				handlePositionListUpdated(eventData);
				break;

			case GameplayWebSocketEventTypes.MOVE_LIST_UPDATED:
				handleMoveListUpdated(eventData);
				break;

			case GameplayWebSocketEventTypes.PLAYER_CHECKMATED:
				handleCheckmate(eventData);
				break;

			case GameplayWebSocketEventTypes.PLAYER_STALEMATED:
				handleDraw("Stalemate");
				break;

			case GameplayWebSocketEventTypes.THREEFOLD_REPETITION_DETECTED:
				handleDraw("Repetition");
				break;

			case GameplayWebSocketEventTypes.FIFTY_MOVE_RULE_DETECTED:
				handleDraw("50-move-rule");
				break;

			case GameplayWebSocketEventTypes.INSUFFICIENT_MATERIAL:
				handleDraw("Insufficient material");
				break;

			case GameplayWebSocketEventTypes.PLAYER_TIMEOUT:
				handlePlayerTimeout(eventData);
				break;

			default:
				break;
		}
	}
}

export default useMultiplayerGameplayWebsocket;
