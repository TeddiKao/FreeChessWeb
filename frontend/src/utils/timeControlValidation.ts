import { TimeDuration } from "../types/gameSetup";

function hasZeroDuration(hours: number, minutes: number, seconds: number): boolean {
	return hours <= 0 && minutes <= 0 && seconds <= 0;
}

function validateBaseTime({ hours, minutes, seconds }: TimeDuration) {
	if (hasZeroDuration(hours, minutes, seconds)) {
		return [false, "zeroDurationError"];
	}
	
	return [true, ""];
}

export { validateBaseTime }