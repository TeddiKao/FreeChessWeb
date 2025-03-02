enum MoveMethods {
	"CLICK" = "click",
	"DRAG" = "drag",
}

enum WebSocketEventTypes {
	"MOVE_MADE" = "move_made",
	"TIMER_DECREMENTED" = "timer_decremented",
	"TIMER_INCREMENTED" = "timer_incremented",
	"POSITION_LIST_UPDATED" = "position_list_updated",
}

export { MoveMethods, WebSocketEventTypes }