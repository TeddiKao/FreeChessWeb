import { useContext, useEffect, useState } from "react";
import { AuthProviderContext } from "@appProviders/AuthProvider";
import useReactiveRef from "../useReactiveRef";

function useWebSocket(
	url: string,
	onMessage?: any,
	onError?: any,
	enabled = true
) {
	const [socketRef, _, setSocket] = useReactiveRef<WebSocket | null>(null);
	const { access: { accessToken } } = useContext(AuthProviderContext)!;

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
			setSocket(null);
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
			if (socketRef.current instanceof WebSocket) {
				if (socketRef.current.readyState === WebSocket.OPEN) {
					socketRef.current.close();
					setSocket(null);
				}
			}
		};
	}, [url, enabled, accessToken]);

	return socketRef.current;
}

export default useWebSocket;
