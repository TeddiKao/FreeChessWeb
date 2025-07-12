import { isEqual } from "lodash";
import { websocketBaseURL } from "@sharedConstants/urls";
import { getAccessToken } from "@auth/utils";

function capitaliseFirstLetter(string: string): string {
	const capitalisedFirstLetter = string.charAt(0).toUpperCase();
	const remainingLetters = string.slice(1);

	return `${capitalisedFirstLetter}${remainingLetters}`;
}

function compareObjects(
	objectA: object | null,
	objectB: object | null
): boolean {
	return isEqual(objectA, objectB);
}

function isNullOrUndefined(value: any): boolean {
	return value === null || value === undefined;
}

function padZero(value: number): string | number {
	if (value >= 10) {
		return value;
	} else {
		return `0${value}`;
	}
}

function isTouchDevice() {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function isObjEmpty(obj: object) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function parseWebsocketUrl(
	websocketRoute: string,
	extraParams?: Record<string, any>
) {
	const accessToken = getAccessToken();
	const urlWithTokenOnly = `${websocketBaseURL}/ws/${websocketRoute}/?token=${accessToken}`;

	let websocketUrl = urlWithTokenOnly;

	if (!extraParams) {
		return websocketUrl;
	}

	for (const paramName of Object.keys(extraParams)) {
		const paramValue = extraParams[paramName];
		const paramUrl = `&${paramName}=${paramValue}`;

		websocketUrl += paramUrl;
	}

	return websocketUrl;
}

export {
	capitaliseFirstLetter,
	compareObjects,
	padZero,
	isTouchDevice,
	isNullOrUndefined,
	parseWebsocketUrl,
	isObjEmpty,
};
