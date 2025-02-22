import {
    blitzTimeControls,
    bulletTimeControls,
    classicalTimeControls,
    rapidTimeControls,
} from "../../constants/timeControls.js";
import { TimeControlTypes } from "../../enums/gameSetup.js";

import { compareObjects } from "../../utils/generalUtils.ts";
import { displayTimeControl } from "../../utils/timeUtils.ts";

function TimeControlSelection({
    timeControlType,
    selectedTimeControl,
    setTimeControl,
}) {
    function handleTimeControlClick(timeControlInfo) {
        setTimeControl({
            baseTime: timeControlInfo.baseTime,
            increment: timeControlInfo.increment,
        });
    }

    function getTimeControlsList() {
        switch (timeControlType.toLowerCase()) {
            case TimeControlTypes.BULLET:
                return bulletTimeControls;
            
            case TimeControlTypes.BLITZ:
                return blitzTimeControls;

            case TimeControlTypes.RAPID:
                return rapidTimeControls;
            
            case TimeControlTypes.CLASSICAL:
                return classicalTimeControls;
            
            default:
                console.error(`Invalid time control type: ${timeControlType}`);
        }
    }

    const timeControls = getTimeControlsList();

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
                            {displayTimeControl({ baseTime: baseTime, increment: increment})}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default TimeControlSelection;
