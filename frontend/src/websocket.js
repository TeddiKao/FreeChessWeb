const url = "ws://localhost:8000/ws/socket-server/"

const websocket = new WebSocket(url)

websocket.onmessage((event) => {
	const data = JSON.parse(event.data)

    console.log(data)
})