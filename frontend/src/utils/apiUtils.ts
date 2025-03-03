import api from "../api.ts";
import { ParsedFENString, PieceColor } from "../types/gameLogic.js";

async function fetchCurrentPosition(gameId: number): Promise<ParsedFENString> {
    let currentPosition = null;

    try {
        const response = await api.post("gameplay_api/get-current-position/", {
            game_id: gameId,
        })

        if (response.status === 200) {
            currentPosition = response.data;
        }
    } catch (error) {
        console.error(error);
    }

    return currentPosition;
}

async function fetchTimer(gameId: number, playerColor: PieceColor) {
    let timer = null;
    try {
        const response = await api.post("gameplay_api/get-player-timer/", {
            game_id: gameId,
            player_color: playerColor,
        })

        if (response.status === 200) {
            timer = response.data;
        }
    } catch (error) {
        console.error(error);
    }

    return timer;
}

async function fetchPositionList(gameId: number) {
    let positionList = null;
    try {
        const response = await api.post("gameplay_api/get-position-list/", {
            game_id: gameId,
        })

        if (response.status === 200) {
            positionList = response.data;
        }

    } catch (error) {
        console.error(error);
    }

    return positionList;
}

async function fetchMoveList(gameId: number) {
    let moveList = null;
    try {
        const response = await api.post("gameplay_api/get-move-list/", {
            game_id: gameId,
        })

        if (response.status === 200) {
            moveList = response.data;
        }

    } catch (error) {
        console.error(error);
    }

    return moveList;
}

async function fetchLegalMoves(
    parsedFENString: object,
    pieceType: string,
    pieceColor: string,
    startingSquare: string | number
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
    parsedFENString: object,
    piece_color: string,
    piece_type: string,
    starting_square: number | string,
    destination_square: number | string,
    additional_info: object = {}
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

    return [isMoveLegal, moveType];
}

async function fetchFen(rawFenString: string): Promise<any> {
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

async function fetchKingIsInCheck(
    boardPlacement: object,
    kingColor: string,
    kingSquare: string | number
) {
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
    } catch (error) {
        console.log(error);
    }

    return isKingInCheck;
}

async function getIsStalemated(currentFEN: ParsedFENString, kingColor: string) {
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

async function getIsCheckmated(currentFEN: object, kingColor: string) {
    let isCheckmated = false;

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
    getIsCheckmated,
    getIsStalemated,
    getUsername,
    fetchCurrentPosition,
    fetchTimer,
    fetchPositionList
};
