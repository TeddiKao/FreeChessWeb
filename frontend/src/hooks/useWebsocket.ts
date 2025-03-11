let websocket: any = null;

function useWebSocket(url: string, onMessage?: any, onError?: any) {
    if (websocket) {
        if (websocket.readyState !== WebSocket.CLOSED) {
            return websocket;
        }
    }

    websocket = new WebSocket(url);

    if (onMessage) {
        websocket.onmessage = onMessage;
    }

    if (onError) {
        websocket.onerror = onError;
    }

    return websocket;
}

export default useWebSocket;
