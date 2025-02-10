import api from "../api.js";
import { getAccessToken } from "./tokenUtils.js";

async function fetchLegalMoves(
    parsedFENString,
    pieceType,
    pieceColor,
    startingSquare
) {
    let legalMoves = [];

    try {
        const response = await api.post(
            "/move_validation_api/show-legal-moves/",
            {
                parsed_fen_string: parsedFENString,
                move_info: {
                    piece_color: pieceColor,
                    piece_type: pieceType,
                    starting_square: startingSquare,
                },
            }
        );

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
    destination_square,
    additional_info = {}
) {
    let isMoveLegal = false;
    let moveType = null;

    try {
        const response = await api.post("/move_validation_api/validate-move/", {
            parsed_fen_string: parsedFENString,
            move_info: {
                piece_color: piece_color,
                piece_type: piece_type,
                starting_square: starting_square,
                destination_square: destination_square,
                additional_info: additional_info,
            },
        });

        if (response.status === 200) {
            isMoveLegal = response.data.is_valid;
            moveType = response.data.move_type;
        }
    } catch (error) {
        console.log(error);
    }

    console.log(moveType);

    return [isMoveLegal, moveType];
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
    } catch (error) {
        console.log(error);
    }

    return parsedFen;
}

async function fetchKingIsInCheck(boardPlacement, kingColor, kingSquare) {
    let isKingInCheck = false;

    try {
        const response = await api.post(
            "/move_validation_api/get-king-is-in-check/",
            {
                board_placement: boardPlacement,
                king_color: kingColor,
                king_square: kingSquare,
            }
        );

        if (response.status === 200) {
            isKingInCheck = response.data;
        }
    } catch {
        console.log(error);
    }

    return isKingInCheck;
}

async function startGame(gameInfo) {
    const timeControlBaseTime = gameInfo["timeControl"]["baseTime"];
    const timeControlIncrement = gameInfo["timeControl"]["increment"];

    try {
        const response = await api.post("/gameplay_api/start-game/", {
            game_info: gameInfo,
        });
        if (response.status === 201) {
        }
    } catch (error) {
        console.log(error);
    }
}

async function getOngoingGames() {
    let ongoingGames = [];

    await api
        .get("gameplay_api/get-ongoing-chess-game/")
        .then((response) => response.data)
        .then((data) => (ongoingGames = data))
        .catch((error) => console.log(error));

    return ongoingGames;
}

async function getIsStalemated(currentFEN, kingColor) {
    let isStalemated = false;
    try {
        const response = await api.post(
            "/move_validation_api/get-is-stalemated/",
            {
                current_fen: currentFEN,
                king_color: kingColor,
            }
        );

        if (response.status === 200) {
            isStalemated = response.data;
        }
    } catch (error) {
        console.log(error);
    }

    return isStalemated;
}

async function getIsCheckmated(currentFEN, kingColor) {
    let isCheckmated = false;

    console.log(currentFEN);

    try {
        const response = await api.post(
            "/move_validation_api/get-is-checkmated/",
            {
                current_fen: currentFEN,
                king_color: kingColor,
            }
        );

        if (response.status === 200) {
            isCheckmated = response.data;
        }
    } catch (error) {
        console.log(error);
    }

    return isCheckmated;
}

async function getUsername() {
    let username = null;
    try {
        const response = await api.get("/users_api/get-username/");
        username = response.data;
    } catch (error) {
        console.log(error);
    }

    return username;
}

export {
    fetchFen,
    fetchKingIsInCheck,
    fetchLegalMoves,
    fetchMoveIsValid,
    startGame,
    getOngoingGames,
    getIsCheckmated,
    getIsStalemated,
    getUsername
};
