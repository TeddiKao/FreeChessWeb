import {
    blitzTimeControls,
    bulletTimeControls,
    classicalTimeControls,
    rapidTimeControls,
} from "../../constants/timeControls.js";
import { compareObjects } from "../../utils.js";

function TimeControlSelection({
    timeControlType,
    selectedTimeControl,
    setTimeControl,
}) {
    function convertTimeControlTime(time) {
        return time / 60;
    }

    function handleTimeControlClick(timeControlInfo) {
        setTimeControl({
            baseTime: timeControlInfo.baseTime,
            increment: timeControlInfo.increment,
        });
    }

    let timeControls = null;
    console.log(timeControlType);
    if (timeControlType === "bullet") {
        timeControls = bulletTimeControls;
    } else if (timeControlType === "blitz") {
        timeControls = blitzTimeControls;
    } else if (timeControlType === "rapid") {
        timeControls = rapidTimeControls;
    } else if (timeControlType === "classical") {
        timeControls = classicalTimeControls;
    }

    return (
        <div className="time-controls-container">
            {timeControls.map(({ id, baseTime, increment }) => {
                return (
                    <div
                        key={id}
                        className={
                            compareObjects(
                                {
                                    baseTime: baseTime,
                                    increment: increment,
                                },
                                selectedTimeControl
                            )
                                ? "selected-time-control-container"
                                : "time-control-container"
                        }
                        onClick={() => {
                            handleTimeControlClick({
                                baseTime: baseTime,
                                increment: increment,
                            });
                        }}
                    >
                        <p>
                            {convertTimeControlTime(baseTime)}
                            {" min "}
                            {increment > 0
                                ? `| ${increment}`
                                : null}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default TimeControlSelection;
