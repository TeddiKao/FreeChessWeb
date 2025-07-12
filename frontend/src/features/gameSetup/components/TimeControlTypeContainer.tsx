import { Dispatch, SetStateAction } from "react";
import { GameSetupStages } from "../enums";
import { StateSetterFunction } from "@sharedTypes/utility.types";

type TimeControlInfo = {
	baseTime: number;
	increment: number;
};

type TimeControlTypeContainerProps = {
	timeControlName: string;
	timeControlDescription: string;
	setSelectionStage: (stage: string) => void;
	setType: Dispatch<SetStateAction<string | null>>;
	setCustomTimeControlCreated: StateSetterFunction<boolean>;
	setSelectedTimeControl: StateSetterFunction<TimeControlInfo | null>;
};

function TimeControlTypeContainer({
	timeControlName,
	timeControlDescription,
	setSelectionStage,
	setType,
	setCustomTimeControlCreated,
	setSelectedTimeControl,
}: TimeControlTypeContainerProps) {
	function handleRegularTimeControlClick(): void {
		setSelectionStage(GameSetupStages.AMOUNT_SELECT);
		setCustomTimeControlCreated(false);
		setSelectedTimeControl(null);
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
