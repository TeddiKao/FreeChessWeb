import { useRef } from "react";
import { websocketBaseURL } from "../constants/urls";
import { getAccessToken } from "../utils/tokenUtils";

interface MatchmakingLogicHookProps {
    baseTime: number;
    increment: number;
}

function useMatchmakingLogic({ baseTime, increment }: MatchmakingLogicHookProps) {
	const matchFoundRef = useRef<boolean | null>(null);
	const gameIdRef = useRef<string | number | null>(null);
	const whitePlayerRef = useRef<string | null>(null);
	const blackPlayerRef = useRef<string | null>(null);

    const matchmakingWebsocketUrl = `${websocketBaseURL}/ws/matchmaking-server/?token=${getAccessToken()}&baseTime=${baseTime}&increment=${increment}`;
}

export default useMatchmakingLogic;
