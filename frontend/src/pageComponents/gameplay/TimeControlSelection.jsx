import {
    blitzTimeControls,
    bulletTimeControls,
    classicalTimeControls,
    rapidTimeControls,
} from "../../constants/timeControls.js";

function TimeControlSelection({ timeControlType }) {
    function convertTimeControlTime(time) {
        return time / 60;
    }

    switch (timeControlType) {
        case "bullet":
            return (
                <div className="time-controls-container">
                    {bulletTimeControls.map((timeControlInfo) => {
						const timeControlElement = (
                            <div
                                key={timeControlInfo.id}
                                className="time-control-container"
                            >
                                <p>
                                    {convertTimeControlTime(
                                        timeControlInfo.baseTime
                                    )}
                                    {" min "}
                                    {timeControlInfo.increment > 0
                                        ? `| ${timeControlInfo.increment}`
                                        : null}
                                </p>
                            </div>
                        );

						return timeControlElement
					})}
                </div>
            );

        case "blitz":
            return (
                <div className="time-controls-container">
                    {blitzTimeControls.map((timeControlInfo) => {
						const timeControlElement = (
                            <div
                                key={timeControlInfo.id}
                                className="time-control-container"
                            >
                                <p>
                                    {convertTimeControlTime(
                                        timeControlInfo.baseTime
                                    )}
                                    {" min "}
                                    {timeControlInfo.increment > 0
                                        ? `| ${timeControlInfo.increment}`
                                        : null}
                                </p>
                            </div>
                        );

						return timeControlElement
					})}
                </div>
            );

        case "rapid":
            return (
                <div className="time-controls-container">
                    {rapidTimeControls.map((timeControlInfo) => {
                        const timeControlElement = (
                            <div
                                key={timeControlInfo.id}
                                className="time-control-container"
                            >
                                <p>
                                    {convertTimeControlTime(
                                        timeControlInfo.baseTime
                                    )}
                                    {" min "}
                                    {timeControlInfo.increment > 0
                                        ? `| ${timeControlInfo.increment}`
                                        : null}
                                </p>
                            </div>
                        );

						return timeControlElement;
                    })}
                </div>
            );

        case "classical":
            return (
                <div className="time-controls-container">
                    {classicalTimeControls.map((timeControlInfo) => {
                        const timeControlElement = (
                            <div
                                key={timeControlInfo.id}
                                className="time-control-container"
                            >
                                <p>
                                    {convertTimeControlTime(
                                        timeControlInfo.baseTime
                                    )}
                                    {" min "}
                                    {timeControlInfo.increment > 0
                                        ? `| ${timeControlInfo.increment}`
                                        : null}
                                </p>
                            </div>
                        );

                        return timeControlElement;
                    })}
                </div>
            );
    }
}

export default TimeControlSelection;
