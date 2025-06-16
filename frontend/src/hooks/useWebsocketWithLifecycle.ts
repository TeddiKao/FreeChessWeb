import { useEffect, useRef, useState } from "react";
import useWebSocket from "./useWebsocket";
import useWebsocketLifecycle from "./useWebsocketLifecycle";

interface WebsocketWithLifecycleHookProps {
	url: string;
	enabled: boolean;
	onMessage: (data: any) => void;
	onError?: () => void;
	closeOnUnload?: boolean;
}

function useWebsocketWithLifecycle({
	url,
	enabled,
	onMessage,
	onError,
	closeOnUnload,
}: WebsocketWithLifecycleHookProps) {
	const socket = useWebSocket(url, onMessage, onError, enabled);
	const socketRef = useRef<WebSocket | null>(null);
	const socketExistsRef = useRef<boolean>(false);

	const [socketEnabled, setSocketEnabled] = useState(enabled);

    closeOnUnload = closeOnUnload ?? true;

	useEffect(() => {
		socketRef.current = socket;
	}, [socket]);

	useEffect(() => {
		setSocketEnabled(enabled);
	}, [enabled]);

	useWebsocketLifecycle({
		websocket: socket,
		websocketRef: socketRef,
		websocketExistsRef: socketExistsRef,
		setWebsocketEnabled: setSocketEnabled,
		handleWindowUnload,
	});

	function handleWindowUnload() {
        if (!closeOnUnload) {
            return;
        }

		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.close();
			socketExistsRef.current = false;
		}
	}

	return { socketRef, socketExistsRef, socketEnabled };
}

export default useWebsocketWithLifecycle;
