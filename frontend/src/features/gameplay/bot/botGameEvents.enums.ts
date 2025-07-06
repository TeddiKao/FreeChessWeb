enum BotGameWebSocketEventTypes {
	MOVE_REGISTERED = "move_registered",
	CHECKMATE_OCCURRED = "checkmate_occurred",
	STALEMATE_OCCURRED = "stalemate_occurred",
	THREEFOLD_REPETITION_OCCURRED = "threefold_repetition_occurred",
	FIFTY_MOVE_RULE_REACHED = "50_move_rule_reached",
	BOT_MOVE_MADE = "bot_move_made",
}

export {
	BotGameWebSocketEventTypes,
};