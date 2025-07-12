import { useEffect, useRef, useState } from "react";
import { websocketBaseURL } from "@sharedConstants/urls";
import { getAccessToken } from "@auth/utils";
import useWebsocketWithLifecycle from "@sharedHooks/websocket/useWebsocketWithLifecycle";
import { useNavigate } from "react-router-dom";
import { getAssignedColor } from "../utils";
import { MatchmakingEvents } from "../matchmaking.enums";

interface MatchmakingLogicHookProps {
	enabled: boolean;
	baseTime: number;
	increment: number;

	cancelSuccess: () => void;

	navigateToTemp?: boolean;
}

function useMatchmakingLogic({
	enabled,
	baseTime,
	increment,
	cancelSuccess,
	navigateToTemp,
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

	navigateToTemp = navigateToTemp ?? false;

	useEffect(() => {
		if (!matchFound) return;
		if (!whitePlayerRef.current) return;
		if (!blackPlayerRef.current) return;

		const handleRedirection = async () => {
			const assignedColor = await getAssignedColor(
				whitePlayerRef.current!,
				blackPlayerRef.current!
			);

			const gameSetupInfo = {
				baseTime,
				increment,
				gameId: gameIdRef.current,

				assignedColor,
				whitePlayerUsername: whitePlayerRef.current,
				blackPlayerUsername: blackPlayerRef.current,
			};

			if (navigateToTemp) {
				navigate("/temp", {
					state: {
						route: "/play",
						routeState: gameSetupInfo,
					},
				});
			} else {
				navigate("/play", { state: gameSetupInfo });
			}
		};

		handleRedirection();
	}, [matchFound, setMatchFound, navigate]);

	function sendMatchmakingCancelMessage() {
		const data = {
			type: "cancel_matchmaking",
		};

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

	return {
		matchmakingStatus,
		cancelMatchmaking: sendMatchmakingCancelMessage,
	};
}

export default useMatchmakingLogic;
