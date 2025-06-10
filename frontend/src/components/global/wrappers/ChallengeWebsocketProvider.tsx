import { ReactNode, useEffect, useRef, useState } from "react";
import { parseWebsocketUrl } from "../../../utils/generalUtils";
import useWebSocket from "../../../hooks/useWebsocket";
import useWebsocketLifecycle from "../../../hooks/useWebsocketLifecycle";

type ChallengeWebsocketProviderProps = {
	children: ReactNode;
};

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

	return children;
}

export default ChallengeWebsocketProvider;
