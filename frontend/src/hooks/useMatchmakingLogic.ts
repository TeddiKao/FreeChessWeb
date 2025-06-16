import { useRef } from "react";
import { websocketBaseURL } from "../constants/urls";
import { getAccessToken } from "../utils/tokenUtils";
import useWebsocketWithLifecycle from "./useWebsocketWithLifecycle";
import { MatchmakingEvents } from "../enums/gameSetup";

interface MatchmakingLogicHookProps {
    enabled: boolean;
    baseTime: number;
    increment: number;
}

function useMatchmakingLogic({ enabled, baseTime, increment }: MatchmakingLogicHookProps) {
	const matchFoundRef = useRef<boolean | null>(null);
	const gameIdRef = useRef<string | number | null>(null);
	const whitePlayerRef = useRef<string | null>(null);
	const blackPlayerRef = useRef<string | null>(null);

    const matchmakingWebsocketUrl = `${websocketBaseURL}/ws/matchmaking-server/?token=${getAccessToken()}&baseTime=${baseTime}&increment=${increment}`;
    const { socketRef: matchmakingWebsocketRef } = useWebsocketWithLifecycle({
        url: matchmakingWebsocketUrl,
        enabled: enabled,
        onMessage: handleOnMessage
    })

    function handleOnMessage(event: MessageEvent): void {
		const parsedEventData = JSON.parse(event.data);
        const eventType = parsedEventData["type"];

        switch (eventType) {
            case MatchmakingEvents.MATCH_FOUND:
                if (parsedEventData["match_found"]) {
                    
                }
                
                break;

            case MatchmakingEvents.CANCELLED_SUCCESSFULLY:
                break;
        }
	}

}

export default useMatchmakingLogic;
