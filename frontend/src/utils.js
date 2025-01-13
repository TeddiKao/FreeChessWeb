import api from "./api.js";

import _ from "lodash"

function clearSquaresStyling() {
    for (let square = 1; square <= 64; square++) {
        const squareElement = document.getElementById(`${square}`);
        if (squareElement) {
            squareElement.classList.remove("legal-square");
        }
    }
}

function capitaliseFirstLetter(string) {
    const firstLetter = string.charAt(0).toUpperCase();
    const remainingLetters = string.slice(1);

    return `${firstLetter}${remainingLetters}`;
}

function compareObjects(objectA, objectB) {
    return _.isEqual(objectA, objectB)
}

function convertTimeControlTime(time) {
	return time / 60
}

function displayTimeControl({ baseTime, increment }) {
	const baseTimeString = `${convertTimeControlTime(baseTime)}`
	const incrementString = increment > 0? `| ${increment}` : ""

	return `${baseTimeString} min ${incrementString}`
}

async function fetchLegalMoves(
    parsedFENString,
    pieceType,
    pieceColor,
    startingSquare
) {
    let legalMoves = [];

    try {
        const response = await api.post("/gameplay_api/show-legal-moves", {
            parsed_fen_string: parsedFENString,
            move_info: {
                piece_color: pieceColor,
                piece_type: pieceType,
                starting_square: startingSquare,
            },
        });

        if (response.status === 200) {
            legalMoves = response.data;
        }
    } catch (error) {
        console.log(error);
    }

    return legalMoves;
}

async function fetchFen(rawFenString) {
    let parsedFen = null;

    try {
        const response = await api.get("/gameplay_api/parse-fen/", {
            params: {
                raw_fen_string: rawFenString,
            },
        });

        parsedFen = response.data;
        console.log(parsedFen);
    } catch (error) {
        console.log(error);
    }

    console.log(parsedFen);
    return parsedFen;
}

export {
    clearSquaresStyling,
    fetchFen,
    fetchLegalMoves,
    capitaliseFirstLetter,
    compareObjects,
	displayTimeControl,
	convertTimeControlTime
};
