import { useEffect, useRef } from "react";

function useWebSocket(
	url: string,
	onMessage?: any,
	onError?: any,
	enabled = true
) {
	const socketRef = useRef<WebSocket | null>(null);
    
    useEffect(() => {
        if (!enabled) {
			return;
		}

        if (socketRef.current) {
            return;
        }

		const websocket = new WebSocket(url);
        socketRef.current = websocket;

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

	return socketRef.current;
}

export default useWebSocket;
