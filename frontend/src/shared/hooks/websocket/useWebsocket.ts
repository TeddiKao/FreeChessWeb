import { useEffect, useRef } from "react";
import useReactiveRef from "@sharedHooks/useReactiveRef";

function useWebSocket(
	url: string,
	onMessage?: any,
	onError?: any,
	enabled = true
) {
	const [socketRef, _, setSocket] = useReactiveRef<WebSocket | null>(null);
	const retryCountRef = useRef(0);

	function retryConnection() {
		retryCountRef.current ++;
		const websocket = new WebSocket(url);
		setSocket(websocket);

		if (onMessage) {
			websocket.onmessage = onMessage;
		}

		websocket.onerror = () => {
			if (onError) {
				onError();
			}

			if (retryCountRef.current < 5) {
				retryConnection();
			}
		};

		websocket.onclose = () => {
			console.log("Websocket closed");
		};

		return () => {
			if (websocket.readyState === WebSocket.OPEN) {
				websocket.close();
				setSocket(null);
			}
		};
	}

	useEffect(() => {
		if (!enabled) {
			return;
		}

		if (socketRef.current) {
			return;
		}

		const websocket = new WebSocket(url);
		setSocket(websocket);

		if (onMessage) {
			websocket.onmessage = onMessage;
		}

		websocket.onerror = () => {
			if (onError) {
				onError();
			}

			if (retryCountRef.current < 5) {
				retryConnection();
			}
		};

		websocket.onclose = () => {
			console.log("Websocket closed");
		};

		return () => {
			if (websocket.readyState === WebSocket.OPEN) {
				websocket.close();
				setSocket(null);
			}
		};
	}, [url, enabled]);

	return socketRef.current;
}

export default useWebSocket;
