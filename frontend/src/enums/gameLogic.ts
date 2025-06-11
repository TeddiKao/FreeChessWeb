enum MoveMethods {
	"CLICK" = "click",
	"DRAG" = "drag",
}

enum GameplayWebSocketEventTypes {
	MOVE_MADE = "move_made",
	TIMER_DECREMENTED = "timer_decremented",
	TIMER_INCREMENTED = "timer_incremented",
	POSITION_LIST_UPDATED = "position_list_updated",
	MOVE_LIST_UPDATED = "move_list_updated",
	CAPTURED_MATERIAL_LIST_UPDATED = "captured_material_list_updated",
	PROMOTED_PIECES_LIST_UPDATED = "promoted_pieces_list_updated",
	PLAYER_STALEMATED = "player_stalemated",
	PLAYER_CHECKMATED = "player_checkmated",
	THREEFOLD_REPETITION_DETECTED = "threefold_repetition_detected",
	FIFTY_MOVE_RULE_DETECTED = "50_move_rule_detected",
	INSUFFICIENT_MATERIAL = "insufficient_material",
	PLAYER_TIMEOUT = "player_timeout",
}

enum BotGameWebSocketEventTypes {
	MOVE_REGISTERED = "move_registered",
	CHECKMATE_OCCURRED = "checkmate_occurred",
	STALEMATE_OCCURRED = "stalemate_occurred",
	THREEFOLD_REPETITION_OCCURRED = "threefold_repetition_occurred",
	FIFTY_MOVE_RULE_REACHED = "50_move_rule_reached",
	BOT_MOVE_MADE = "bot_move_made",
}

enum ActionWebSocketEventTypes {
	PLAYER_RESIGNED = "player_resigned",
	DRAW_OFFERED = "draw_offered",
	DRAW_OFFER_ACCPETED = "draw_accepted",
	DRAW_OFFER_DECLINED = "draw_declined",
}

enum ChallengeWebsocketEventTypes {
	CHALLENGE_RECEIVED = "challenge_received",
	CHALLENGE_ACCEPTED = "challenge_accepted",
	CHALLENGE_DECLINED = "challenge_declined",
}

export {
	MoveMethods,
	GameplayWebSocketEventTypes,
	ActionWebSocketEventTypes,
	BotGameWebSocketEventTypes,
	ChallengeWebsocketEventTypes
};
