import { ReactNode, useEffect, useRef, useState, createContext } from "react";
import { parseWebsocketUrl } from "../../../utils/generalUtils";
import useWebSocket from "../../../hooks/useWebsocket";
import useWebsocketLifecycle from "../../../hooks/useWebsocketLifecycle";

type ChallengeWebsocketProviderProps = {
	children: ReactNode;
};

type ChallengeWebsocketContextType = {
	challengeWebsocket: WebSocket | null;
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

	function handleOnMessage() {}

	function handleWindowUnload() {
		if (challengeWebsocketRef.current?.readyState == WebSocket.OPEN) {
			challengeWebsocketRef.current.close();
			challengeWebsocketExistsRef.current = false;
		}
	}

	return (
		<ChallengeWebsocketContext.Provider
			value={{ challengeWebsocket: challengeWebsocketRef.current }}
		>
			{children}
		</ChallengeWebsocketContext.Provider>
	);
}

export default ChallengeWebsocketProvider;
