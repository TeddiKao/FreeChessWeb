function TimeControlTypeContainer({ timeControlName, timeControlDescription, setSelectionStage, setType }) {
    function handleRegularTimeControlClick() {
		setSelectionStage("amountSelection")
		setType(timeControlName)
	}

    function handleCustomTimeControlClick() {
		setSelectionStage("amountSelection")
		setType(timeControlName)
	}

    return (
        <div
            onClick={
                timeControlName !== "Custom"
                    ? handleRegularTimeControlClick
                    : handleCustomTimeControlClick
            }

            className={`${timeControlName.toLowerCase()}`}
        >
            <h1>{timeControlName}</h1>
            <p>{timeControlDescription}</p>
        </div>
    );
}

export default TimeControlTypeContainer;
