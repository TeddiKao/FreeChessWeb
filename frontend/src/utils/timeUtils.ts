import { floor } from "lodash";
import { padZero } from "./generalUtils.ts";
import { TimeControl } from "../types/gameSetup.ts";

function convertTimeControlTime(time: number) {
	return time / 60;
}

function formatTime(timeInSeconds: number): string {
	const hours: number = floor(timeInSeconds / (60 * 60));
	const minutes: number = floor((timeInSeconds % (60 * 60)) / 60);
	const seconds: number = floor(timeInSeconds % 60);

	const hoursString: string = hours > 0 ? `${hours}` : "";
	const minutesString: string = hours > 0 ? `${padZero(minutes)}` : `${minutes}`;
	const secondsString: string = `${padZero(seconds)}`;

	const hasLeadingColon: boolean = hours > 0
	const leadingColon: string = hasLeadingColon ? ":" : "";

	const trimmedTimeString: string = `${hoursString}${leadingColon}${minutesString}:${secondsString}`.trim();
	
	return trimmedTimeString;
}

function displayTimeControl({ baseTime, increment }: TimeControl): string {
	const baseTimeString: string = `${convertTimeControlTime(baseTime)}`;
	const incrementString: string = increment > 0 ? `| ${increment}` : "";

	const timeControlString: string = `${baseTimeString} min ${incrementString}`;

	return timeControlString;
}

export { formatTime, displayTimeControl }