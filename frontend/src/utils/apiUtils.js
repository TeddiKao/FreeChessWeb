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
    console.log(piece_color)

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
	fetchFen,
	fetchKingIsInCheck,
	fetchLegalMoves,
	fetchMoveIsValid,
}