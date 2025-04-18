enum GameSetupStages {
	TYPE_SELECT = "typeSelection",
	AMOUNT_SELECT = "amountSelection",
	CUSTOM_TIME_CREATE = "customTimeControlCreation",
	CONFIRM_START = "startConfirmation"
}

enum TimeControlValidationErrors {
	ZERO_DURATION = "zeroDurationError"
}

enum MatchmakingEvents {
	MATCH_FOUND = "match_found",
	CANCELLED_SUCCESSFULLY = "matchmaking_cancelled_successfully",
}

enum TimeControls {
	BULLET = "bullet",
	BLITZ = "blitz",
	RAPID = "rapid",
	CLASSICAL = "classical"
}

export { GameSetupStages, TimeControls, MatchmakingEvents, TimeControlValidationErrors }