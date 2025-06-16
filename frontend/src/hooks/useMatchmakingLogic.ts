import { useEffect, useRef, useState } from "react";
import { websocketBaseURL } from "../constants/urls";
import { getAccessToken } from "../utils/tokenUtils";
import useWebsocketWithLifecycle from "./useWebsocketWithLifecycle";
import { MatchmakingEvents } from "../enums/gameSetup";
import { useNavigate } from "react-router-dom";
import { getAssignedColor } from "../utils/matchmakingUtils";

interface MatchmakingLogicHookProps {
	enabled: boolean;
	baseTime: number;
	increment: number;

    cancelSuccess: () => void;
}

function useMatchmakingLogic({
	enabled,
	baseTime,
	increment,
    cancelSuccess
}: MatchmakingLogicHookProps) {
	const [matchmakingStatus, setMatchmakingStatus] =
		useState<string>("Finding match");
	const [matchFound, setMatchFound] = useState<boolean>(false);

	const matchFoundRef = useRef<boolean | null>(null);
	const gameIdRef = useRef<string | number | null>(null);
	const whitePlayerRef = useRef<string | null>(null);
	const blackPlayerRef = useRef<string | null>(null);

	const matchmakingWebsocketUrl = `${websocketBaseURL}/ws/matchmaking-server/?token=${getAccessToken()}&baseTime=${baseTime}&increment=${increment}`;
	const { socketRef: matchmakingWebsocketRef } = useWebsocketWithLifecycle({
		url: matchmakingWebsocketUrl,
		enabled: enabled,
		onMessage: handleOnMessage,
	});

	const navigate = useNavigate();

	useEffect(() => {
        if (!matchFound) return;
        if (!whitePlayerRef.current) return;
        if (!blackPlayerRef.current) return;
		const handleRedirection = async () => {
			const gameSetupInfo = {
				baseTime,
				increment,
				gameId: gameIdRef.current,

				assignedColor: await getAssignedColor(whitePlayerRef.current!, blackPlayerRef.current!),

                whitePlayerUsername: whitePlayerRef.current,
                blackPlayerUsername: blackPlayerRef.current,
			};

            navigate("/play", { state: gameSetupInfo })
		};

        handleRedirection();
	}, [matchFound, setMatchFound, navigate]);

    function sendMatchmakingCancelMessage() {
        const data = {
            type: "cancel_matchmaking"
        }

        matchmakingWebsocketRef?.current?.send(JSON.stringify(data));
    }

	function handleOnMessage(event: MessageEvent): void {
		const parsedEventData = JSON.parse(event.data);
		const eventType = parsedEventData["type"];

		switch (eventType) {
			case MatchmakingEvents.MATCH_FOUND:
				handleMatchFound(parsedEventData);

				break;

			case MatchmakingEvents.CANCELLED_SUCCESSFULLY:
                cancelSuccess();
				break;
		}
	}

	function handleMatchFound(parsedEventData: any) {
		matchmakingWebsocketRef.current?.close();

		setMatchmakingStatus("Match found");

		matchFoundRef.current = true;
		gameIdRef.current = parsedEventData["game_id"];

		const whitePlayer = parsedEventData["white_player"];
		const blackPlayer = parsedEventData["black_player"];

		whitePlayerRef.current = whitePlayer;
		blackPlayerRef.current = blackPlayer;

		setMatchFound(true);
	}

    return { matchmakingStatus, matchFound, cancelMatchmaking: sendMatchmakingCancelMessage };
}

export default useMatchmakingLogic;
