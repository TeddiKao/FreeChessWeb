let websocket = null;

function useWebSocket(url, onMessage, onError, protocolField) {
    if (websocket) {
        if (websocket.readyState !== WebSocket.CLOSED) {
            return websocket;
        }
    }

    websocket = new WebSocket(url, protocolField);

    websocket.onopen = () => {};

    websocket.onmessage = onMessage;
    websocket.onerror = onError;
    websocket.onclose = (event) => {};

    return websocket;
}

export default useWebSocket;
