import { useContext, useEffect, useState } from "react";
import { AuthProviderContext } from "@appProviders/AuthProvider";

function useWebSocket(
	url: string,
	onMessage?: any,
	onError?: any,
	enabled = true
) {
	const [socket, setSocket] = useState<WebSocket | null>(null);
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
			console.log("Websocket closed");
		};
	}

	useEffect(() => {
		if (!enabled) {
			return;
		}

		if (socket) {
			return;
		}

		createAndSetupWebSocket();

		return () => {
			if (socket?.readyState === WebSocket.OPEN) {
				socket.close();
				setSocket(null);
			}
		};
	}, [url, enabled]);

	useEffect(() => {
		createAndSetupWebSocket();
	}, [accessToken]);

	return socket;
}

export default useWebSocket;
