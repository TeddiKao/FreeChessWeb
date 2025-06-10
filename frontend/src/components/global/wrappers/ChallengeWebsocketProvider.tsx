import { ReactNode, useEffect, useRef, useState, createContext } from "react";
import { parseWebsocketUrl } from "../../../utils/generalUtils";
import useWebSocket from "../../../hooks/useWebsocket";
import useWebsocketLifecycle from "../../../hooks/useWebsocketLifecycle";

type ChallengeWebsocketProviderProps = {
	children: ReactNode;
};

type ChallengeWebsocketContextType = {
	challengeWebsocket: WebSocket | null;
	sendChallenge: (recepientUsername: string) => void;
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

	function sendChallenge(recepientUsername: string) {
		if (challengeWebsocketRef.current?.readyState == WebSocket.OPEN) {
			challengeWebsocketRef.current.send(
				JSON.stringify({
					type: "challenge",
					challenge_recepient: recepientUsername,
				})
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

	function handleWindowUnload() {
		if (challengeWebsocketRef.current?.readyState == WebSocket.OPEN) {
			challengeWebsocketRef.current.close();
			challengeWebsocketExistsRef.current = false;
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
			{children}
		</ChallengeWebsocketContext.Provider>
	);
}

export default ChallengeWebsocketProvider;
export { ChallengeWebsocketContext }
