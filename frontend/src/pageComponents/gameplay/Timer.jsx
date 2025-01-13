import "../../styles/timer.css"
import { formatTime } from "../../utils.js"

function Timer({ playerColor, timeInSeconds }) {
	return (
		<div className={`${playerColor}-player-timer-container`}>
			<p className="timer-amount">{formatTime(timeInSeconds)}</p>
		</div>
	)
}

export default Timer