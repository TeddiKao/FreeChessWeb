import { useEffect, useRef, useState } from "react";
import "../../../../styles/modals/game-over-modal.scss";
import {
	capitaliseFirstLetter,
	parseWebsocketUrl,
} from "../../../../utils/generalUtils";
import useWebSocket from "../../../../hooks/useWebsocket";
import { TimeControl } from "../../../../types/gameSetup";
import { useNavigate } from "react-router-dom";
import { MatchmakingEvents } from "../../../../enums/gameSetup";
import { getAssignedColor } from "../../../../utils/matchmakingUtils";
import MatchmakingShortcutScreen from "../MatchmakingShortcutScreen";

type GameOverModalProps = {
	visible: boolean;
	gameEndCause: string;
	gameWinner: string | null;
	timeControlInfo: TimeControl;
};

function GameOverModal({
	visible,
	gameEndCause,
	gameWinner,
	timeControlInfo,
}: GameOverModalProps) {
	const [matchmakingWebsocketEnabled, setMatchmakingWebsocketEnabled] =
		useState(false);

	const [matchFound, setMatchFound] = useState(false);
	const [isMatchmaking, setIsMatchmaking] = useState(false);

	const gameIdRef = useRef<string | number | null>(null);
	const whitePlayerRef = useRef<string | null>(null);
	const blackPlayerRef = useRef<string | null>(null);

	const matchmakingWebsocketRef = useRef<WebSocket | null>(null);
	const matchmakingWebsocketExists = useRef<boolean>(false);

	const navigate = useNavigate();

	const websocketUrl = parseWebsocketUrl("matchmaking-server", {
		baseTime: timeControlInfo.baseTime,
		increment: timeControlInfo.increment,
		gameId: gameIdRef.current,
	});

	const matchmakingWebsocket = useWebSocket(
		websocketUrl,
		handleOnMessage,
		undefined,
		matchmakingWebsocketEnabled
	);

	useEffect(() => {
		matchmakingWebsocketRef.current = matchmakingWebsocket;

		return () => {
			if (
				matchmakingWebsocketRef.current?.readyState === WebSocket.OPEN
			) {
				matchmakingWebsocketRef.current.close();
			}
		};
	}, []);

	useEffect(() => {
		async function handleNavigation() {
			if (
				matchmakingWebsocketRef.current?.readyState === WebSocket.OPEN
			) {
				matchmakingWebsocketRef.current.close();
				matchmakingWebsocketExists.current = false;
			}

			const gameSetupInfo = {
				baseTime: timeControlInfo.baseTime,
				increment: timeControlInfo.increment,
				gameId: gameIdRef.current,
				assignedColor: await getAssignedColor(
					whitePlayerRef.current!,
					blackPlayerRef.current!
				),
			};

			navigate("/temp", {
				state: {
					route: "/play",
					routeState: gameSetupInfo,
				},
			});
		}

		if (matchFound) {
			handleNavigation();
		}
	}, [matchFound]);

	function handleMatchFound(parsedEventData: any) {
		matchmakingWebsocketRef.current?.close();

		setIsMatchmaking(false);
		setMatchmakingWebsocketEnabled(false);

		gameIdRef.current = parsedEventData["game_id"];

		const whitePlayer = parsedEventData["white_player"];
		const blackPlayer = parsedEventData["black_player"];

		whitePlayerRef.current = whitePlayer;
		blackPlayerRef.current = blackPlayer;

		setTimeout(() => {
			setMatchFound(true);
		}, 50);
	}

	function handleOnMessage(eventData: any) {
		const parsedEventData = JSON.parse(eventData.data);
		const eventType = parsedEventData["type"];

		switch (eventType) {
			case MatchmakingEvents.MATCH_FOUND:
				if (parsedEventData["match_found"]) {
					handleMatchFound(parsedEventData);
				}

				break;
		}
	}

	if (!visible) {
		return null;
	}

	const gameResultText = !gameWinner
		? "Draw"
		: `${capitaliseFirstLetter(gameWinner)} won`;
	const gameEndCauseText = capitaliseFirstLetter(gameEndCause);

	function handleNewGameCreation() {
		setMatchmakingWebsocketEnabled(true);
		setIsMatchmaking(true);
	}

	return (
		<>
			<div className="game-over-modal-container">
				<h1 className="game-result">{gameResultText}</h1>
				<p className="game-end-cause">by {gameEndCauseText}</p>
				<div className="buttons-container">
					<button
						onClick={handleNewGameCreation}
						className="new-game-button"
					>
						New game
					</button>
					<button className="rematch-button">Rematch</button>
				</div>
			</div>

			<MatchmakingShortcutScreen
				timeControlInfo={timeControlInfo}
				visible={isMatchmaking}
			/>
		</>
	);
}

export default GameOverModal;
