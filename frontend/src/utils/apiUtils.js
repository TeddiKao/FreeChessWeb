import api from "../api.js";

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
    } catch (error) {
        console.log(error);
    }

    return parsedFen;
}

async function fetchKingIsInCheck(boardPlacement, kingColor, kingSquare) {
    let isKingInCheck = false;

    try {
        const response = await api.post("/gameplay_api/get-king-is-in-check/", {
            board_placement: boardPlacement,
            king_color: kingColor,
            king_square: kingSquare,
        });

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

async function getIsStalemated(boardPlacement, castlingRights, kingColor) {
    let isStalemated = false;
    try {
        const response = await api.post("/gameplay_api/get-is-stalemated/", {
            board_placement: boardPlacement,
            castling_rights: castlingRights,
            king_color: kingColor,
        });

        if (response.status === 200) {
            isStalemated = response.data;
        }
    } catch (error) {
        console.log(error);
    }

    return isStalemated;
}

async function getIsCheckmated(boardPlacement, castlingRights, kingColor) {
    console.log("Getting checkmate")
    
    let isCheckmated = false;

    try {
        const response = await api.post("/gameplay_api/get-is-checkmated/", {
            board_placement: boardPlacement,
            castling_rights: castlingRights,
            king_color: kingColor,
        });

        if (response.status === 200) {
            isCheckmated = response.data;
        }
    } catch (error) {
        console.log(error);
    }

    return isCheckmated;
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
};
