import "../../styles/timer.css"

function Timer({ playerColor }) {
	return (
		<div className={`${playerColor}-player-timer-container`}>
			<p className="timer-amount">1:00:00</p>
		</div>
	)
}

export default Timer