import React, { useState } from "react";
import "../../styles/matchmaking/custom-time-control-screen.css";
import { StateSetterFunction } from "../../types/general";
import { convertTimeControlToSeconds } from "../../utils/timeUtils";
import { TimeControl, TimeDuration } from "../../types/gameSetup";

type CustomTimeControlScreenProps = {
    setSelectionStage: StateSetterFunction<string>;
	setSelectedTimeControl: StateSetterFunction<TimeControl | null>
};

function CustomTimeControlScreen({
    setSelectionStage,
	setSelectedTimeControl,
}: CustomTimeControlScreenProps) {
    const [baseTimeHours, setBaseTimeHours] = useState<number | string>("");
    const [baseTimeMinutes, setBaseTimeMinutes] = useState<number | string>("");
    const [baseTimeSeconds, setBaseTimeSeconds] = useState<number | string>("");

    const [incrementHours, setIncrementHours] = useState<number | string>("");
    const [incrementMinutes, setIncrementMinutes] = useState<number | string>(
        ""
    );
    const [incrementSeconds, setIncrementSeconds] = useState<number | string>(
        ""
    );

    function handleContinue() {
		const baseTimeDuration: TimeDuration = {
			hours: Number(baseTimeHours),
			minutes: Number(baseTimeMinutes),
            seconds: Number(baseTimeSeconds),
		}

		const incrementDuration: TimeDuration = {
            hours: Number(incrementHours),
            minutes: Number(incrementMinutes),
            seconds: Number(incrementSeconds),
        }

		const baseTimeInSeconds = convertTimeControlToSeconds(baseTimeDuration);
		const incrementTimeInSeconds = convertTimeControlToSeconds(incrementDuration);

		setSelectedTimeControl({
			baseTime: baseTimeInSeconds,
			increment: incrementTimeInSeconds
		})

        setSelectionStage("startConfirmation");
    }

    function handleBaseTimeHoursChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        setBaseTimeHours(event.target.value);
    }

    function handleBaseTimeMinutesChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        setBaseTimeMinutes(event.target.value);
    }

    function handleBaseTimeSecondsChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        setBaseTimeSeconds(event.target.value);
    }

    function handleIncrementHoursChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        setIncrementHours(event.target.value);
    }

    function handleIncrementMinutesChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        setIncrementMinutes(event.target.value);
    }

    function handleIncrementSecondsChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        setIncrementSeconds(event.target.value);
    }

    return (
        <div className="custom-time-control-screen">
            <h1 className="screen-header">Create time control</h1>
            <div className="base-time-container">
                <h3 className="base-time-header">Base time</h3>
                <div className="time-inputs">
                    <input
                        className="hours-input"
                        type="text"
                        placeholder="hr"
                        onChange={handleBaseTimeHoursChange}
                        min={0}
                        value={baseTimeHours}
                    />
                    <input
                        className="minutes-input"
                        type="text"
                        placeholder="min"
                        onChange={handleBaseTimeMinutesChange}
                        min={0}
                        value={baseTimeMinutes}
                    />
                    <input
                        className="seconds-input"
                        type="text"
                        placeholder="sec"
                        onChange={handleBaseTimeSecondsChange}
                        min={0}
                        value={baseTimeSeconds}
                    />
                </div>
            </div>

            <div className="increment-container">
                <h3 className="increment-header">Increment</h3>
                <div className="time-inputs">
                    <input
                        className="hours-input"
                        type="text"
                        placeholder="hr"
                        onChange={handleIncrementHoursChange}
                        min={0}
                        value={incrementHours}
                    />
                    <input
                        className="minutes-input"
                        type="text"
                        placeholder="min"
                        onChange={handleIncrementMinutesChange}
                        min={0}
                        value={incrementMinutes}
                    />
                    <input
                        className="seconds-input"
                        type="text"
                        placeholder="sec"
                        onChange={handleIncrementSecondsChange}
                        min={0}
                        value={incrementSeconds}
                    />
                </div>
            </div>

            <button
                onClick={handleContinue}
                className="custom-time-control-continue-button"
            >
                Continue
            </button>
        </div>
    );
}

export default CustomTimeControlScreen;
