enum MoveMethods {
	"CLICK" = "click",
	"DRAG" = "drag",
}

enum WebSocketEventTypes {
	MOVE_MADE = "move_made",
	TIMER_DECREMENTED = "timer_decremented",
	TIMER_INCREMENTED = "timer_incremented",
	POSITION_LIST_UPDATED = "position_list_updated",
	MOVE_LIST_UPDATED = "move_list_updated",
	PLAYER_RESIGNED = "player_resigned",
	PLAYER_STALEMATED = "player_stalemated",
	PLAYER_CHECKMATED = "player_checkmated",
	PLAYER_TIMEOUT = "player_timeout"
}

export { MoveMethods, WebSocketEventTypes }