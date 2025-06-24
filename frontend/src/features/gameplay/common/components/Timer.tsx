import "../styles/timer.scss";
import {
	formatTime,
	getLowTimeThreshold,
} from "../../../../utils/timeUtils.ts";

type TimerProps = {
	playerColor: string;
	timeInSeconds: number;
	startingTimeInSeconds: number;
	isActive?: boolean;
};

function Timer({
	playerColor,
	timeInSeconds,
	startingTimeInSeconds,
	isActive = true,
}: TimerProps) {
	function hasLowTime() {
		return timeInSeconds <= getLowTimeThreshold(startingTimeInSeconds);
	}

	function getIsActiveTimerClass() {
		if (isActive) {
			return "active-timer";
		} else {
			return "inactive-timer";
		}
	}

	function getLowTimeTimerClass() {
		if (hasLowTime()) {
			return "low-time";
		} else {
			return `${playerColor}-player-timer-container`;
		}
	}

	return (
		<div className={`${getLowTimeTimerClass()} ${getIsActiveTimerClass()}`}>
			<p className="timer-amount">{formatTime(timeInSeconds)}</p>
		</div>
	);
}

export default Timer;
