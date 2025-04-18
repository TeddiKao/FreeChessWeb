import {
    blitzTimeControls,
    bulletTimeControls,
    classicalTimeControls,
    rapidTimeControls,
} from "../../constants/timeControls.js";
import { TimeControls } from "../../enums/gameSetup.ts";

import { compareObjects } from "../../utils/generalUtils.ts";
import { displayTimeControl } from "../../utils/timeUtils.ts";

interface TimeControlInfo {
    id?: number,
    baseTime: number,
    increment: number
}

type setTimeControl = (value: TimeControlInfo) => void;

type TimeControlSelectionProps = {
    timeControlType: string,
    selectedTimeControl: TimeControlInfo | null,
    setTimeControl: setTimeControl
}

function TimeControlSelection({
    timeControlType,
    selectedTimeControl,
    setTimeControl,
}: TimeControlSelectionProps) {
    function handleTimeControlClick(timeControlInfo: TimeControlInfo) {
        setTimeControl({
            baseTime: timeControlInfo.baseTime,
            increment: timeControlInfo.increment,
        });
    }

    function getTimeControlsList(): Array<TimeControlInfo> | undefined {
        switch (timeControlType.toLowerCase()) {
            case TimeControls.BULLET:
                return bulletTimeControls;
            
            case TimeControls.BLITZ:
                return blitzTimeControls;

            case TimeControls.RAPID:
                return rapidTimeControls;
            
            case TimeControls.CLASSICAL:
                return classicalTimeControls;
            
            default:
                console.error(`Invalid time control type: ${timeControlType}`);
        }
    }

    const timeControls: Array<TimeControlInfo> | undefined = getTimeControlsList();
    if (!timeControls) {
        return null;
    }


    return (
        <div className="time-controls-container">
            {timeControls.map(({ id, baseTime, increment }: TimeControlInfo) => {
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
