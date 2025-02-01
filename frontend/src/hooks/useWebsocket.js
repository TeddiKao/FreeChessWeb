let websocket = null;

function useWebSocket(url, onMessage, onError) {
    if (websocket) {
        if (websocket.readyState !== WebSocket.CLOSED) {
            return websocket;
        }
    }

    websocket = new WebSocket(url);

    websocket.onmessage = onMessage;
    websocket.onerror = onError;

    return websocket;
}

export default useWebSocket;
