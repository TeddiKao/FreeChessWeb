import { useState } from "react";
import "../../styles/matchmaking/custom-time-control-screen.css";

function CustomTimeControlScreen() {
    const [baseTimeHours, setBaseTimeHours] = useState<number | string>("");
    const [baseTimeMinutes, setBaseTimeMinutes] = useState<number | string>("");
    const [baseTimeSeconds, setBaseTimeSeconds] = useState<number | string>("");

    const [incrementHours, setIncrementHours] = useState<number>(0);
    const [incrementMinutes, setIncrementMinutes] = useState<number>(0);
    const [incrementSeconds, setIncrementSeconds] = useState<number>(0);

    return (
        <div className="custom-time-control-screen">
            <h1 className="screen-header">Create time control</h1>
            <div className="base-time-container">
                <h3 className="base-time-header">Base time</h3>
                <div className="time-inputs">
                    <input
                        className="hours-input"
                        placeholder="hr"
                        value={baseTimeHours}
                    />
                    <input
                        className="minutes-input"
                        placeholder="min"
                        value={baseTimeMinutes}
                    />
                    <input
                        className="seconds-input"
                        placeholder="sec"
                        value={baseTimeSeconds}
                    />
                </div>
            </div>

            <div className="increment-container">
                <h3 className="increment-header">Increment</h3>
                <div className="time-inputs">
                    <input
                        className="hours-input"
                        placeholder="hr"
                        value={incrementHours}
                    />
                    <input
                        className="minutes-input"
                        placeholder="min"
                        value={incrementMinutes}
                    />
                    <input
                        className="seconds-input"
                        placeholder="sec"
                        value={incrementSeconds}
                    />
                </div>
            </div>
        </div>
    );
}

export default CustomTimeControlScreen;
