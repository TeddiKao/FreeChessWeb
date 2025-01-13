import { blitzTimeControls, bulletTimeControls, classicalTimeControls, rapidTimeControls } from "../../constants/timeControls.js";

function TimeControlSelection({ timeControlType }) {
    switch (timeControlType) {
        case "bullet":
            return bulletTimeControls.map((timeControlInfo) => (
                <div key={timeControlInfo.id} className="bullet-time-control">
                    <p>
                        {timeControlInfo.baseTime}{" "}
                        {timeControlInfo.increment > 0 ? (
                            <p>| {timeControlInfo.increment}</p>
                        ) : null}
                    </p>
                </div>
            ));

		case "blitz":
			return blitzTimeControls.map((timeControlInfo) => (
                <div key={timeControlInfo.id} className="bullet-time-control">
                    <p>
                        {timeControlInfo.baseTime}{" "}
                        {timeControlInfo.increment > 0 ? (
                            <p>| {timeControlInfo.increment}</p>
                        ) : null}
                    </p>
                </div>
            ));

		case "rapid":
			return rapidTimeControls.map((timeControlInfo) => (
                <div key={timeControlInfo.id} className="bullet-time-control">
                    <p>
                        {timeControlInfo.baseTime}{" "}
                        {timeControlInfo.increment > 0 ? (
                            <p>| {timeControlInfo.increment}</p>
                        ) : null}
                    </p>
                </div>
            ));

		case "classical":
			return classicalTimeControls.map((timeControlInfo) => (
                <div key={timeControlInfo.id} className="bullet-time-control">
                    <p>
                        {timeControlInfo.baseTime}{" "}
                        {timeControlInfo.increment > 0 ? (
                            <p>| {timeControlInfo.increment}</p>
                        ) : null}
                    </p>
                </div>
            ));
    }
}

export default TimeControlSelection;
