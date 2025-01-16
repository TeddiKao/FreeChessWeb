import { floor } from "lodash";
import { padZero } from "./generalUtils.js";

function convertTimeControlTime(time) {
	return time / 60;
}

function formatTime(timeInSeconds) {
	const hours = floor(timeInSeconds / (60 * 60));
	const minutes = floor((timeInSeconds % (60 * 60)) / 60);
	const seconds = floor(timeInSeconds % 60);

	const hoursString = hours > 0 ? `${hours}` : "";
	const minutesString = hours > 0 ? `${padZero(minutes)}` : `${minutes}`;
	const secondsString = `${padZero(seconds)}`;

	const leadingColon = hours > 0 ? ":" : "";

	return `${hoursString}${leadingColon}${minutesString}:${secondsString}`.trim();
}

function displayTimeControl({ baseTime, increment }) {
	const baseTimeString = `${convertTimeControlTime(baseTime)}`;
	const incrementString = increment > 0 ? `| ${increment}` : "";

	return `${baseTimeString} min ${incrementString}`;
}

export { formatTime, displayTimeControl }