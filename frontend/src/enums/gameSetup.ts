enum TimeControlValidationErrors {
	ZERO_DURATION = "zeroDurationError"
}

enum MatchmakingEvents {
	MATCH_FOUND = "match_found",
	CANCELLED_SUCCESSFULLY = "matchmaking_cancelled_successfully",
}

export { MatchmakingEvents, TimeControlValidationErrors }