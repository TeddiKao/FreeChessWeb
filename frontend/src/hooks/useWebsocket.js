let websocket = null;

function useWebSocket(url, onMessage, onError, protocolField) {
    if (websocket) {
        if (websocket.readyState !== WebSocket.CLOSED) {
			return websocket;
		}
    }

    websocket = new WebSocket(url, protocolField);

    console.log("Websocket created successfully");
    console.log(`Protocol field: ${protocolField}`);
	console.log(`Websocket ready state ${websocket.readyState}`)

	websocket.onopen = () => {
		console.log("Websockt opened!")
	}

    websocket.onmessage = onMessage;
    websocket.onerror = onError;
    websocket.onclose = (event) => {
        console.log("Connection closed");
        console.log(event.code);
    };

    return websocket;
}

export default useWebSocket;
