import api from "./api.js";

import _, { floor } from "lodash";

function clearSquaresStyling() {
    for (let square = 0; square <= 63; square++) {
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
    return _.isEqual(objectA, objectB);
}

function convertTimeControlTime(time) {
    return time / 60;
}

function padZero(value) {
    return `0${value}`;
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

async function fetchLegalMoves(
    parsedFENString,
    pieceType,
    pieceColor,
    startingSquare
) {
    let legalMoves = [];

    try {
        const response = await api.post("/gameplay_api/show-legal-moves/", {
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

async function fetchMoveIsValid(
    parsedFENString,
    piece_color,
    piece_type,
    starting_square,
    destination_square
) {
    let isMoveLegal = false;
    try {
        const response = await api.post("/gameplay_api/validate-move/", {
            parsed_fen_string: parsedFENString,
            move_info: {
                piece_color: piece_color,
                piece_type: piece_type,
                starting_square: starting_square,
                destination_square: destination_square,
            },
        });

        if (response.status === 200) {
            isMoveLegal = response.data.is_valid;
        }

    } catch (error) {
        console.log(error);
    }

    return isMoveLegal;
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

async function fetchKingIsInCheck(boardPlacement, kingColor, kingSquare) {
    let isKingInCheck = false;

    try {
        const response = await api.post("/gameplay_api/get-king-is-in-check/", {
            board_placement: boardPlacement,
            king_color: kingColor,
            king_square: kingSquare
        })

        if (response.status === 200) {
            isKingInCheck = response.data
        }

    } catch {
        console.log(error);
    }

    return isKingInCheck
}

export {
    fetchKingIsInCheck,
    clearSquaresStyling,
    fetchFen,
    fetchLegalMoves,
    capitaliseFirstLetter,
    compareObjects,
    displayTimeControl,
    convertTimeControlTime,
    formatTime,
    fetchMoveIsValid
};
