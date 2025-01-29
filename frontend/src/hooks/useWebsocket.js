function useWebSocket(url, onMessage, onError, protocolField) {
	const websocket = new WebSocket(url, protocolField);

	websocket.onmessage = onMessage
	websocket.onerror = onError;

	return websocket;
}

export default useWebSocket