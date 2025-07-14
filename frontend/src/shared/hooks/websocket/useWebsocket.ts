import { useEffect } from "react";
import useReactiveRef from "@sharedHooks/useReactiveRef";
import useAccessToken from "@features/auth/hooks/useAccessToken";

function useWebSocket(
	url: string,
	onMessage?: any,
	onError?: any,
	enabled = true
) {
	const [socketRef, _, setSocket] = useReactiveRef<WebSocket | null>(null);
	const { accessToken } = useAccessToken()

	function createAndSetupWebSocket() {
		const websocket = new WebSocket(url);
		setSocket(websocket);

		if (onMessage) {
			websocket.onmessage = onMessage;
		}

		if (onError) {
			websocket.onerror = onError;
		}

		websocket.onclose = () => {
			console.log("Websocket closed");
		};
	}

	useEffect(() => {
		if (!enabled) {
			return;
		}

		if (socketRef.current) {
			return;
		}

		createAndSetupWebSocket();

		return () => {
			if (socketRef.current?.readyState === WebSocket.OPEN) {
				socketRef.current.close();
				setSocket(null);
			}
		};
	}, [url, enabled]);

	useEffect(() => {
		socketRef.current = null;
		createAndSetupWebSocket();
	}, [accessToken]);

	return socketRef.current;
}

export default useWebSocket;
