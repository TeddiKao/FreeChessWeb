import { isEqual } from "lodash";

function capitaliseFirstLetter(string: string): string {
	const capitalisedFirstLetter = string.charAt(0).toUpperCase();
	const remainingLetters = string.slice(1);

	return `${capitalisedFirstLetter}${remainingLetters}`;
}

function compareObjects(objectA: object | null, objectB: object | null): boolean {
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
	return ("ontouchstart" in window) || navigator.maxTouchPoints > 0;
}

export {
	capitaliseFirstLetter,
	compareObjects,
	padZero,
	isTouchDevice,
	isNullOrUndefined,
}