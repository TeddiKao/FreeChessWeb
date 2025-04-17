function useWebSocket(url: string, onMessage?: any, onError?: any) {
    const websocket = new WebSocket(url);

    if (onMessage) {
        websocket.onmessage = onMessage;
    }

    if (onError) {
        websocket.onerror = onError;
    }

    websocket.onclose = (event: CloseEvent) => {
        
    }

    return websocket;
}

export default useWebSocket;
