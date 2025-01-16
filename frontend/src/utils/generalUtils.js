import { isEqual } from "lodash";

function capitaliseFirstLetter(string) {
	const firstLetter = string.charAt(0).toUpperCase();
	const remainingLetters = string.slice(1);

	return `${firstLetter}${remainingLetters}`;
}

function compareObjects(objectA, objectB) {
	return isEqual(objectA, objectB);
}

function padZero(value) {
    return `0${value}`;
}

export {
	capitaliseFirstLetter,
	compareObjects,
	padZero
}