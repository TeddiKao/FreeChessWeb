function TimeControlTypeContainer({ timeControlName, timeControlDescription }) {
	return (
		<div className={`${timeControlName.toLowerCase()}`}>
			<h1>{timeControlName}</h1>
			<p>{timeControlDescription}</p>
		</div>
	)
}

export default TimeControlTypeContainer