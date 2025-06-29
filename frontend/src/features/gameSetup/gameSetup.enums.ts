enum GameSetupStages {
	TYPE_SELECT = "typeSelection",
	AMOUNT_SELECT = "amountSelection",
	CUSTOM_TIME_CREATE = "customTimeControlCreation",
	CONFIRM_START = "startConfirmation"
}

enum TimeControls {
	BULLET = "bullet",
	BLITZ = "blitz",
	RAPID = "rapid",
	CLASSICAL = "classical"
}

export type { GameSetupStages, TimeControls }