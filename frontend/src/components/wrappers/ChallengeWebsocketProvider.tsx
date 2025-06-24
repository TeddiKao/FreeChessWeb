import { ReactNode, useEffect, useRef, useState, createContext } from "react";
import { parseWebsocketUrl } from "../../utils/generalUtils";
import useWebSocket from "../../hooks/useWebsocket";
import useWebsocketLifecycle from "../../hooks/useWebsocketLifecycle";
import ChallengeNotification from "../../features1/modals/ChallengeNotification";
import { TimeControl } from "../../types/gameSetup";
import { ChallengeRelationships } from "../../types/challenge";
import { ChallengeWebsocketEventTypes } from "../../enums/gameLogic";
import {
	ChallengeAcceptedWebsocketEventData,
	ChallengeReceivedWebsocketEventData,
	ChallengeSuccessfullySentEventData,
} from "../../interfaces/challenge";
import { useNavigate } from "react-router-dom";
import ChallengeResponseWaitScreen from "../../features1/modals/ChallengeResponseWaitScreen";
import useWebsocketWithLifecycle from "../../hooks/useWebsocketWithLifecycle";

type ChallengeWebsocketProviderProps = {
	children: ReactNode;
};

type ChallengeWebsocketContextType = {
	challengeWebsocket: WebSocket | null;
	sendChallenge: (
		recepientUsername: string,
		relationship: ChallengeRelationships,
		challengeTimeControl: TimeControl
	) => void;
	acceptChallenge: (senderUsername: string) => void;
	declineChallenge: (senderUsername: string) => void;
};

const ChallengeWebsocketContext = createContext<
	ChallengeWebsocketContextType | undefined
>(undefined);

function ChallengeWebsocketProvider({
	children,
}: ChallengeWebsocketProviderProps) {
	const websocketURL = parseWebsocketUrl("challenge-server");

	const [challengeReceived, setChallengeReceived] = useState<boolean>(false);
	const [challengerUsername, setChallengerUsername] = useState<string>("");
	const [challengerRelationship, setChallengerRelationship] =
		useState<string>("");
	const [challengeReceivedTimeControl, setChallengeReceivedTimeControl] =
		useState<TimeControl | null>(null);

	const [sentTimeControl, setSentTimeControl] = useState<TimeControl | null>(
		null
	);
	const [waitingForResponse, setWaitingForResponse] =
		useState<boolean>(false);

	const navigate = useNavigate();

	const { socketRef: challengeWebsocketRef } = useWebsocketWithLifecycle({
		url: websocketURL,
		enabled: true,
		onMessage: handleOnMessage,
		closeOnUnload: false,
	});

	function handleOnMessage(event: MessageEvent) {
		const data = JSON.parse(event.data);
		const messageType = data["type"];

		switch (messageType) {
			case ChallengeWebsocketEventTypes.CHALLENGE_RECEIVED:
				handleChallengeReceived(data);
				break;

			case ChallengeWebsocketEventTypes.CHALLENGE_ACCEPTED:
				handleChallengeAccepted(data);
				break;

			case ChallengeWebsocketEventTypes.CHALLENGE_SUCCESSFULLY_SENT:
				handleChallengeSuccessfullySent(data);
				break;

			case ChallengeWebsocketEventTypes.CHALLENGE_DECLINED:
				handleChallengeDeclined();
				break;
		}
	}

	function handleChallengeReceived(
		data: ChallengeReceivedWebsocketEventData
	) {
		setChallengeReceived(true);
		setChallengerUsername(data["challenge_sender"]);
		setChallengerRelationship(data["relationship"]);
		setChallengeReceivedTimeControl(data["challenge_time_control"]);
	}

	function handleChallengeSuccessfullySent(
		data: ChallengeSuccessfullySentEventData
	) {
		setWaitingForResponse(true);
		setSentTimeControl(data["challenge_time_control"]);
	}

	function handleChallengeAccepted(
		data: ChallengeAcceptedWebsocketEventData
	) {
		setWaitingForResponse(false);
		setSentTimeControl(null);

		navigate("/temp", {
			state: {
				route: "/play",
				routeState: {
					gameId: data["game_id"],
					baseTime: data["base_time"],
					increment: data["increment"],
					assignedColor: data["assigned_color"],

					whitePlayerUsername: data["white_player_username"],
					blackPlayerUsername: data["black_player_username"],
				},
			},
		});
	}

	function handleChallengeDeclined() {
		setWaitingForResponse(false);
		setSentTimeControl(null);
	}

	function sendChallenge(
		recepientUsername: string,
		relationship: ChallengeRelationships,
		challengeTimeControl: TimeControl
	) {
		if (challengeWebsocketRef.current?.readyState == WebSocket.OPEN) {
			const challengeDetails = {
				type: "send_challenge",
				challenge_recepient: recepientUsername,
				relationship: relationship,
				challenge_time_control: challengeTimeControl,
			};

			challengeWebsocketRef.current.send(
				JSON.stringify(challengeDetails)
			);
		}
	}

	function acceptChallenge(senderUsername: string) {
		setChallengeReceived(false);

		if (challengeWebsocketRef.current?.readyState == WebSocket.OPEN) {
			challengeWebsocketRef.current.send(
				JSON.stringify({
					type: "accept_challenge",
					challenge_sender: senderUsername,
				})
			);
		}
	}

	function declineChallenge(senderUsername: string) {
		setChallengeReceived(false);

		if (challengeWebsocketRef.current?.readyState == WebSocket.OPEN) {
			challengeWebsocketRef.current.send(
				JSON.stringify({
					type: "decline_challenge",
					challenge_sender: senderUsername,
				})
			);
		}
	}

	return (
		<ChallengeWebsocketContext.Provider
			value={{
				challengeWebsocket: challengeWebsocketRef.current,
				sendChallenge,
				acceptChallenge,
				declineChallenge,
			}}
		>
			<ChallengeNotification
				visible={challengeReceived}
				challengerUsername={challengerUsername}
				challengerRelationship={
					challengerRelationship as ChallengeRelationships
				}
				timeControl={challengeReceivedTimeControl}
			/>

			<ChallengeResponseWaitScreen
				visible={waitingForResponse}
				timeControlInfo={sentTimeControl}
			/>

			{children}
		</ChallengeWebsocketContext.Provider>
	);
}

export default ChallengeWebsocketProvider;
export { ChallengeWebsocketContext };
