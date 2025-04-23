import { useEffect, useState } from "react";

function useWebSocket(
	url: string,
	onMessage?: any,
	onError?: any,
	enabled = true
) {
	const [socketState, setSocketState] = useState<WebSocket | null>(null);
    
    useEffect(() => {
		if (!enabled) {
			return;
		}

		const websocket = new WebSocket(url);
        setSocketState(websocket);

		if (onMessage) {
			websocket.onmessage = onMessage;
		}

		if (onError) {
			websocket.onerror = onError;
		}

        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
        }
	}, [url, enabled]);

	return socketState;
}

export default useWebSocket;
