import { useEffect } from "react";
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

		websocket.onclose = () => {
			console.log("Websocket closed");
		}

        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
				setSocket(null);
            }
        }
	}, [url, enabled]);

	return socketRef.current;
}

export default useWebSocket;
