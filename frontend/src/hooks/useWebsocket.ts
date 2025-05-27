import { useEffect, useRef } from "react";
import useReactiveRef from "./useReactiveRef";

function useWebSocket(
	url: string,
	onMessage?: any,
	onError?: any,
	enabled = true
) {
	const [socketRef, _, setSocket] = useReactiveRef<WebSocket | null>(null);
    
    useEffect(() => {
        if (!enabled) {
			return;
		}

        if (socketRef.current) {
			console.log(socketRef.current)
            return;
        }

		const websocket = new WebSocket(url);
        setSocket(websocket);

		if (onMessage) {
			websocket.onmessage = onMessage;
		}

		if (onError) {
			websocket.onerror = onError;
		}

        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
				socketRef.current = null;
            }
        }
	}, [url, enabled]);

	return socketRef.current;
}

export default useWebSocket;
