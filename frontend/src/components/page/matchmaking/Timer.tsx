import "../../../styles/features/gameplay/timer.scss";
import { formatTime, getLowTimeThreshold } from "../../../utils/timeUtils.ts";

type TimerProps = {
    playerColor: string;
    timeInSeconds: number;
    startingTimeInSeconds: number;
};

function Timer({ playerColor, timeInSeconds, startingTimeInSeconds }: TimerProps) {
    function hasLowTime() {
        return timeInSeconds <= getLowTimeThreshold(startingTimeInSeconds);
    }

    function getTimerClass() {
        if (hasLowTime()) {
            return "low-time";
        } else {
            return `${playerColor}-player-timer-container`;
        }
    }

    return (
        <div className={getTimerClass()}>
            <p className="timer-amount">{formatTime(timeInSeconds)}</p>
        </div>
    );
}

export default Timer;
