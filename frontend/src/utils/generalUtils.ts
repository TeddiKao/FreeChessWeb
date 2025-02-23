import { isEqual } from "lodash";

function capitaliseFirstLetter(string: string): string {
	const firstLetter = string.charAt(0).toUpperCase();
	const remainingLetters = string.slice(1);

	return `${firstLetter}${remainingLetters}`;
}

function compareObjects(objectA: object | null, objectB: object | null): boolean {
	return isEqual(objectA, objectB);
}

function padZero(value: number): string | number {
    if (value >= 10) {
		return value;
	} else {
		return `0${value}`;
	}
}

export {
	capitaliseFirstLetter,
	compareObjects,
	padZero
}