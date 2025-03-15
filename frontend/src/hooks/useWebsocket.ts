function useWebSocket(url: string, onMessage?: any, onError?: any) {
    const websocket = new WebSocket(url);

    if (onMessage) {
        websocket.onmessage = onMessage;
    }

    if (onError) {
        websocket.onerror = onError;
    }

    return websocket;
}

export default useWebSocket;
