import { ReactNode, useEffect, useRef, useState, createContext } from "react";
import { parseWebsocketUrl } from "../../../utils/generalUtils";
import useWebSocket from "../../../hooks/useWebsocket";
import useWebsocketLifecycle from "../../../hooks/useWebsocketLifecycle";
import ChallengeNotification from "../modals/ChallengeNotification";
import { TimeControl } from "../../../types/gameSetup";
import { ChallengeRelationships } from "../../../types/challenge";

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
	const [challengeWebsocketEnabled, setChallengeWebsocketEnabled] =
		useState(false);

	const [challengeReceived, setChallengeReceived] = useState<boolean>(false);
	const [challengerUsername, setChallengerUsername] = useState<string>("");
	const [challengerRelationship, setChallengerRelationship] =
		useState<string>("");
	const [challengeTimeControl, setChallengeTimeControl] =
		useState<TimeControl | null>(null);

	const challengeWebsocketRef = useRef<WebSocket | null>(null);
	const challengeWebsocketExistsRef = useRef<boolean>(false);

	const socket = useWebSocket(
		websocketURL,
		handleOnMessage,
		undefined,
		challengeWebsocketEnabled
	);

	useWebsocketLifecycle({
		websocket: socket,
		websocketRef: challengeWebsocketRef,
		websocketExistsRef: challengeWebsocketExistsRef,
		setWebsocketEnabled: setChallengeWebsocketEnabled,
		handleWindowUnload: handleWindowUnload,
	});

	useEffect(() => {
		challengeWebsocketRef.current = socket;
	}, [socket]);

	function handleOnMessage(event: MessageEvent) {
		console.log(JSON.parse(event.data));
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
				challengeTimeControl: challengeTimeControl
			};
			
			challengeWebsocketRef.current.send(
				JSON.stringify(challengeDetails)
			);
		}
	}

	function acceptChallenge(senderUsername: string) {
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
		if (challengeWebsocketRef.current?.readyState == WebSocket.OPEN) {
			challengeWebsocketRef.current.send(
				JSON.stringify({
					type: "decline_challenge",
					challenge_sender: senderUsername,
				})
			);
		}
	}

	function handleWindowUnload() {}

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
				timeControl={challengeTimeControl}
			/>

			{children}
		</ChallengeWebsocketContext.Provider>
	);
}

export default ChallengeWebsocketProvider;
export { ChallengeWebsocketContext };
