import { Dispatch, SetStateAction } from "react";
import { GameSetupStages } from "../../enums/gameSetup";

type TimeControlTypeContainerProps = {
    timeControlName: string;
    timeControlDescription: string;
    setSelectionStage: (stage: string) => void;
    setType: Dispatch<SetStateAction<string | null>>
};

function TimeControlTypeContainer({
    timeControlName,
    timeControlDescription,
    setSelectionStage,
    setType,
}: TimeControlTypeContainerProps) {
    function handleRegularTimeControlClick(): void {
        setSelectionStage(GameSetupStages.AMOUNT_SELECT);
        setType(timeControlName);
    }

    function handleCustomTimeControlClick(): void {
        setSelectionStage(GameSetupStages.CUSTOM_TIME_CREATE);
        setType(timeControlName);
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
