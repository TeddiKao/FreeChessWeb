import "../../styles/features/gameplay/timer.scss";
import { formatTime } from "../../../utils/timeUtils.ts";

type TimerProps = {
    playerColor: string;
    timeInSeconds: number;
};

function Timer({ playerColor, timeInSeconds }: TimerProps) {
    return (
        <div className={`${playerColor}-player-timer-container`}>
            <p className="timer-amount">{formatTime(timeInSeconds)}</p>
        </div>
    );
}

export default Timer;
