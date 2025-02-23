import { Dispatch, SetStateAction } from "react";

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
        setSelectionStage("amountSelection");
        setType(timeControlName);
    }

    function handleCustomTimeControlClick(): void {
        setSelectionStage("amountSelection");
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
