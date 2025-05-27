import { useEffect, useState, useRef } from "react";
import { displayTimeControl } from "../../../utils/timeUtils.ts";

import useWebSocket from "../../../hooks/useWebsocket.ts";

import "../../../styles/features/gameSetup/matchmaking-screen.scss";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../../utils/tokenUtils.ts";
import { getUsername } from "../../../utils/apiUtils.ts";
import { MatchmakingEvents } from "../../../enums/gameSetup.ts";
import { websocketBaseURL } from "../../../constants/urls.ts";

type timeControlInfo = {
	baseTime: number;
	increment: number;
};

type gameSetupStageFunction = (stage: string) => void;

type MatchmakingScreenProps = {
	timeControlInfo: timeControlInfo;
	setGameSetupStage: gameSetupStageFunction;
};

function MatchmakingScreen({
	timeControlInfo: { baseTime, increment },
	setGameSetupStage,
}: MatchmakingScreenProps) {
	const [matchmakingStatus, setMatchmakingStatus] =
		useState<string>("Finding match");
	const [isMatchmaking, setIsMatchmaking] = useState<boolean>(true);
	const [websocketConnected, setWebsocketConnected] =
		useState<boolean>(false);
	const [matchFound, setMatchFound] = useState<boolean>(false);

	const matchFoundRef = useRef<boolean | null>(null);
	const gameIdRef = useRef<string | number | null>(null);
	const whitePlayerRef = useRef<string | null>(null);
	const blackPlayerRef = useRef<string | null>(null);

	const matchmakingWebsocketRef = useRef<WebSocket | null>(null);
	const matchmakingWebsocketExists = useRef<boolean>(false);

	const websocketURL = `${websocketBaseURL}/ws/matchmaking-server/?token=${getAccessToken()}&baseTime=${baseTime}&increment=${increment}`;
	
    const shouldBeginMatchmaking = isMatchmaking && !websocketConnected && !matchmakingWebsocketExists.current
    
	const [matchmakingWebsocketEnabled, setMatchmakingWebsocketEnabled] = useState(shouldBeginMatchmaking);
	const matchmakingWebsocket = useWebSocket(websocketURL, onMessage, onError, matchmakingWebsocketEnabled);

	const navigate = useNavigate();

	useEffect(() => {
		async function onMatchFound() {
			if (matchFound) {
				if (matchmakingWebsocketRef.current) {
					if (
						matchmakingWebsocketRef.current.readyState ===
						WebSocket.OPEN
					) {
						matchmakingWebsocketRef.current.close();
						matchmakingWebsocketExists.current = false;
					}
				}

				const gameSetupInfo = {
					baseTime,
					increment,
					gameId: gameIdRef.current,
					assignedColor: await getAssignedColor(),
				};

				navigate("/play", {
					state: gameSetupInfo,
				});
			}
		}

		onMatchFound();
	}, [matchFound, setMatchFound, navigate]);

	useEffect(() => {
		window.addEventListener("beforeunload", handleWindowUnload);

		if (isMatchmaking) {
			if (!websocketConnected) {
				if (!matchmakingWebsocketExists.current) {   
					matchmakingWebsocketRef.current = matchmakingWebsocket;
					matchmakingWebsocketExists.current = true;

					setMatchmakingWebsocketEnabled(true);
				}
			}
		}

		return () => {
			window.removeEventListener("beforeunload", handleWindowUnload);

			if (
				matchmakingWebsocketRef.current?.readyState === WebSocket.OPEN
			) {
				matchmakingWebsocketRef.current.close();
				matchmakingWebsocketExists.current = false;
			}
		};
	}, []);

	useEffect(() => {
		matchmakingWebsocketRef.current = matchmakingWebsocket;
	}, [matchmakingWebsocket]);

	function handleWindowUnload() {
		if (matchmakingWebsocketRef.current?.readyState === WebSocket.OPEN) {
			matchmakingWebsocketRef.current.close();
			matchmakingWebsocketExists.current = false;
		}
	}

	function onMessage(event: MessageEvent): void {
		const parsedEventData = JSON.parse(event.data);

		if (parsedEventData["type"] === MatchmakingEvents.MATCH_FOUND) {
			if (parsedEventData["match_found"]) {
				handleMatchFound(parsedEventData);
			}

			return;
		}

		if (
			parsedEventData["type"] === MatchmakingEvents.CANCELLED_SUCCESSFULLY
		) {
			handleMatchmakingCancelSuccess();
		}
	}

	async function getAssignedColor(): Promise<string> {
		const username: string = await getUsername();
		const assignedColor: string =
			username === whitePlayerRef.current ? "White" : "Black";

		return assignedColor;
	}

	function handleMatchFound(parsedEventData: any) {
		matchmakingWebsocketRef.current?.close();

		setMatchmakingStatus("Match found");

		setWebsocketConnected(() => false);
		setIsMatchmaking(() => false);

		matchFoundRef.current = true;
		gameIdRef.current = parsedEventData["game_id"];

		const whitePlayer = parsedEventData["white_player"];
		const blackPlayer = parsedEventData["black_player"];

		whitePlayerRef.current = whitePlayer;
		blackPlayerRef.current = blackPlayer;

		setTimeout(() => {
			setMatchFound(true);
		}, 50);
	}

	function onError() {}

	function handleMatchmakingCancelSuccess(): void {
		setIsMatchmaking(false);
		setGameSetupStage("timeControlSelection");
	}

	function handleMatchmakingCancel() {
		const cancellationDetails = {
			type: "cancel_matchmaking",
		};

		const stringfiedData = JSON.stringify(cancellationDetails);

		matchmakingWebsocketRef.current?.send(stringfiedData);
	}

	return (
		<div className="matchmaking-screen-container">
			<h1 className="matchmaking-heading">{matchmakingStatus}</h1>
			<p className="matchmaking-time-control">
				{displayTimeControl({ baseTime, increment })}
			</p>
			<button
				onClick={handleMatchmakingCancel}
				className="cancel-matchmaking"
			>
				Cancel
			</button>
		</div>
	);
}

export default MatchmakingScreen;
