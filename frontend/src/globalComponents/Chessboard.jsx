import { useState, useEffect } from "react";

import "../styles/chessboard.css";
import Square from "./Square";

import { clearSquaresStyling } from "../utils/boardUtils.js";
import { fetchLegalMoves, fetchMoveIsValid } from "../utils/apiUtils.js";
import { capitaliseFirstLetter } from "../utils/generalUtils.js";

import {
    whiteKingsideCastlingSquare,
    blackKingsideCastlingSquare,
    whiteQueensideCastlingSquare,
    blackQueensideCastlingSquare,
} from "../constants/castlingSquares.js";

function Chessboard({ parsed_fen_string, orientation }) {
    const [previousClickedSquare, setPreviousClickedSquare] = useState(null);
    const [clickedSquare, setClickedSquare] = useState(null);
    const [parsedFENString, setParsedFENString] = useState(parsed_fen_string);

    const [draggedSquare, setDraggedSquare] = useState(null);
    const [droppedSquare, setDroppedSquare] = useState(null);

    useEffect(() => {
        setParsedFENString(parsed_fen_string);
    }, [parsed_fen_string]);

    useEffect(() => {
        handleClickToMove();
    }, [previousClickedSquare, clickedSquare]);

    useEffect(() => {
        handleOnDrop();
    }, [draggedSquare, droppedSquare]);

    async function handleOnDrop() {
        clearSquaresStyling();

        if (!(draggedSquare && droppedSquare)) {
            if (!draggedSquare) {
                return;
            }

            const boardPlacement = parsedFENString["board_placement"];
            const squareInfo = boardPlacement[`${draggedSquare}`];
            const pieceType = squareInfo["piece_type"];
            const pieceColor = squareInfo["piece_color"];

            displayLegalMoves(pieceType, pieceColor, draggedSquare);

            return;
        }

        if (draggedSquare === droppedSquare) {
            setDraggedSquare(null);
            setDroppedSquare(null);

            return;
        }

        const boardPlacementToValidate = parsedFENString["board_placement"];
        const squareInfoToValidate =
            boardPlacementToValidate[`${draggedSquare}`];

        const pieceTypeToValidate = squareInfoToValidate["piece_type"];
        const pieceColorToValidate = squareInfoToValidate["piece_color"];

        const moveIsLegal = await fetchMoveIsValid(
            parsedFENString,
            pieceColorToValidate,
            pieceTypeToValidate,
            draggedSquare,
            droppedSquare
        );

        if (!moveIsLegal) {
            setDraggedSquare(null);
            setDroppedSquare(null);
            return;
        }

        setParsedFENString((previousFENString) => {
            const boardPlacement = previousFENString["board_placement"];
            const squareInfo = boardPlacement[`${draggedSquare}`];

            const pieceType = squareInfo["piece_type"];
            const pieceColor = squareInfo["piece_color"];
            const initialSquare = squareInfo["starting_square"];

            console.log(initialSquare);

            let newPiecePlacements = {
                ...previousFENString,
                board_placement: {
                    ...boardPlacement,
                    [`${droppedSquare}`]: {
                        piece_type: pieceType,
                        piece_color: pieceColor,
                    },
                },
            };

            delete newPiecePlacements["board_placement"][`${draggedSquare}`];

            if (pieceTypeToValidate.toLowerCase() === "rook") {
                const kingsideRookSquares = [7, 63];
                const queensideRookSquares = [0, 56];

                if (kingsideRookSquares.includes(parseInt(initialSquare))) {
                    newPiecePlacements = {
                        ...newPiecePlacements,
                        castling_rights: {
                            ...newPiecePlacements["castling_rights"],
                            [capitaliseFirstLetter(pieceColorToValidate)]: {
                                ...newPiecePlacements["castling_rights"][
                                    capitaliseFirstLetter(pieceColorToValidate)
                                ],
                                Kingside: false,
                            },
                        },
                    };
                }

                if (queensideRookSquares.includes(parseInt(initialSquare))) {
                    newPiecePlacements = {
                        ...newPiecePlacements,
                        castling_rights: {
                            ...newPiecePlacements["castling_rights"],
                            [capitaliseFirstLetter(pieceColorToValidate)]: {
                                ...newPiecePlacements["castling_rights"][
                                    capitaliseFirstLetter(pieceColorToValidate)
                                ],
                                Queenside: false,
                            },
                        },
                    };
                }
            }

            if (pieceTypeToValidate.toLowerCase() === "king") {
                newPiecePlacements = {
                    ...newPiecePlacements,
                    castling_rights: {
                        ...newPiecePlacements["castling_rights"],
                        [capitaliseFirstLetter(pieceColorToValidate)]: {
                            Kingside: false,
                            Queenside: false,
                        },
                    },
                };

                console.log(droppedSquare, whiteQueensideCastlingSquare);

                if (
                    parseInt(droppedSquare) === whiteKingsideCastlingSquare ||
                    parseInt(droppedSquare) === blackKingsideCastlingSquare
                ) {
                    newPiecePlacements = {
                        ...newPiecePlacements,
                        board_placement: {
                            ...newPiecePlacements["board_placement"],
                            [`${parseInt(droppedSquare) - 1}`]: {
                                piece_type: "Rook",
                                piece_color: pieceColorToValidate,
                                starting_square: `${
                                    parseInt(droppedSquare) + 1
                                }`,
                            },
                        },
                    };

                    console.log(newPiecePlacements["board_placement"]);
                    delete newPiecePlacements["board_placement"][
                        `${parseInt(droppedSquare) + 1}`
                    ];
                }

                if (
                    parseInt(droppedSquare) === whiteQueensideCastlingSquare ||
                    parseInt(droppedSquare) === blackQueensideCastlingSquare
                ) {
                    newPiecePlacements = {
                        ...newPiecePlacements,
                        board_placement: {
                            ...newPiecePlacements["board_placement"],
                            [`${parseInt(droppedSquare) + 1}`]: {
                                piece_type: "Rook",
                                piece_color: pieceColorToValidate,
                                starting_square: `${
                                    parseInt(droppedSquare) - 2
                                }`,
                            },
                        },
                    };

                    delete newPiecePlacements["board_placement"][
                        `${parseInt(droppedSquare) - 2}`
                    ];
                }
            }

            return newPiecePlacements;
        });

        setDraggedSquare(null);
        setDroppedSquare(null);
    }

    async function handleClickToMove() {
        clearSquaresStyling();

        if (!(previousClickedSquare && clickedSquare)) {
            if (!previousClickedSquare) {
                return;
            }

            const boardPlacement = parsedFENString["board_placement"];
            const squareInfo = boardPlacement[`${previousClickedSquare}`];

            const pieceType = squareInfo["piece_type"];
            const pieceColor = squareInfo["piece_color"];
            const currentSquare = `${previousClickedSquare}`;

            displayLegalMoves(pieceType, pieceColor, currentSquare);

            return;
        }

        if (previousClickedSquare === clickedSquare) {
            setPreviousClickedSquare(null);
            setClickedSquare(null);

            return;
        }

        if (
            !Object.keys(parsedFENString["board_placement"]).includes(
                previousClickedSquare
            )
        ) {
            setPreviousClickedSquare(null);
            setClickedSquare(null);

            return;
        }

        const boardPlacement = parsedFENString["board_placement"];
        const pieceTypeToValidate =
            boardPlacement[`${previousClickedSquare}`]["piece_type"];
        const pieceColorToValidate =
            boardPlacement[`${previousClickedSquare}`]["piece_color"];

        const isMoveLegal = await fetchMoveIsValid(
            parsedFENString,
            pieceColorToValidate,
            pieceTypeToValidate,
            previousClickedSquare,
            clickedSquare
        );

        if (!isMoveLegal) {
            return;
        }

        setParsedFENString((previousFENString) => {
            const oringinalBoardPlacements =
                previousFENString["board_placement"];

            const pieceType =
                oringinalBoardPlacements[`${previousClickedSquare}`][
                    "piece_type"
                ];
            const pieceColor =
                oringinalBoardPlacements[`${previousClickedSquare}`][
                    "piece_color"
                ];

            let newBoardPlacements = {
                ...previousFENString,
                board_placement: {
                    ...previousFENString["board_placement"],
                    [`${clickedSquare}`]: {
                        piece_type: pieceType,
                        piece_color: pieceColor,
                    },
                },
            };

            delete newBoardPlacements["board_placement"][
                `${previousClickedSquare}`
            ];

            if (pieceTypeToValidate.toLowerCase() === "rook") {
                const kingsideRookSquares = [7, 63];
                const queensideRookSquares = [0, 56];

                if (kingsideRookSquares.includes(parseInt(initialSquare))) {
                    newPiecePlacements = {
                        ...newPiecePlacements,
                        castling_rights: {
                            ...newPiecePlacements["castling_rights"],
                            [capitaliseFirstLetter(pieceColorToValidate)]: {
                                ...newPiecePlacements["castling_rights"][
                                    capitaliseFirstLetter(pieceColorToValidate)
                                ],
                                Kingside: false,
                            },
                        },
                    };
                }

                if (queensideRookSquares.includes(parseInt(initialSquare))) {
                    newPiecePlacements = {
                        ...newPiecePlacements,
                        castling_rights: {
                            ...newPiecePlacements["castling_rights"],
                            [capitaliseFirstLetter(pieceColorToValidate)]: {
                                ...newPiecePlacements["castling_rights"][
                                    capitaliseFirstLetter(pieceColorToValidate)
                                ],
                                Queenside: false,
                            },
                        },
                    };
                }
            }

            if (pieceTypeToValidate.toLowerCase() === "king") {
                newPiecePlacements = {
                    ...newPiecePlacements,
                    castling_rights: {
                        ...newPiecePlacements["castling_rights"],
                        [capitaliseFirstLetter(pieceColorToValidate)]: {
                            Kingside: false,
                            Queenside: false,
                        },
                    },
                };

                console.log(droppedSquare, whiteQueensideCastlingSquare);

                if (
                    parseInt(droppedSquare) === whiteKingsideCastlingSquare ||
                    parseInt(droppedSquare) === blackKingsideCastlingSquare
                ) {
                    newPiecePlacements = {
                        ...newPiecePlacements,
                        board_placement: {
                            ...newPiecePlacements["board_placement"],
                            [`${parseInt(droppedSquare) - 1}`]: {
                                piece_type: "Rook",
                                piece_color: pieceColorToValidate,
                                starting_square: `${
                                    parseInt(droppedSquare) + 1
                                }`,
                            },
                        },
                    };

                    console.log(newPiecePlacements["board_placement"]);
                    delete newPiecePlacements["board_placement"][
                        `${parseInt(droppedSquare) + 1}`
                    ];
                }

                if (
                    parseInt(droppedSquare) === whiteQueensideCastlingSquare ||
                    parseInt(droppedSquare) === blackQueensideCastlingSquare
                ) {
                    newPiecePlacements = {
                        ...newPiecePlacements,
                        board_placement: {
                            ...newPiecePlacements["board_placement"],
                            [`${parseInt(droppedSquare) + 1}`]: {
                                piece_type: "Rook",
                                piece_color: pieceColorToValidate,
                                starting_square: `${
                                    parseInt(droppedSquare) - 2
                                }`,
                            },
                        },
                    };

                    delete newPiecePlacements["board_placement"][
                        `${parseInt(droppedSquare) - 2}`
                    ];
                }
            }

            return newBoardPlacements;
        });

        setPreviousClickedSquare(null);
        setClickedSquare(null);
    }

    async function displayLegalMoves(pieceType, pieceColor, startingSquare) {
        const legalMoves = await fetchLegalMoves(
            parsedFENString,
            pieceType,
            pieceColor,
            startingSquare
        );

        if (!legalMoves) {
            return;
        }

        for (const legalMove of legalMoves) {
            const square = document.getElementById(legalMove);
            if (square) {
                square.classList.add("legal-square");
            }
        }
    }

    if (!parsedFENString) {
        return null;
    }

    const piecePlacements = parsedFENString["board_placement"];

    function handleSquareClick(event, square) {
        const container = document.getElementById(square);
        event.target = container;

        if (!previousClickedSquare && !clickedSquare) {
            setPreviousClickedSquare(event.target.id);
        } else {
            setClickedSquare(event.target.id);
        }
    }

    function generateChessboard() {
        const squareElements = [];

        const startingRow = orientation === "White" ? 8 : 1;
        const endingRow = orientation === "White" ? 1 : 8;

        for (
            let row = startingRow;
            orientation === "White" ? row >= endingRow : row <= endingRow;
            orientation === "White" ? row-- : row++
        ) {
            const startingIndex = (row - 1) * 8 + 1;
            const endingIndex = row * 8;

            for (let square = startingIndex; square <= endingIndex; square++) {
                const file = square - startingIndex + 1;

                const squareIsLight = (file + row) % 2 !== 0;
                const squareColor = squareIsLight ? "light" : "dark";

                const boardPlacementSquare = `${square - 1}`;
                if (
                    Object.keys(piecePlacements).includes(boardPlacementSquare)
                ) {
                    const pieceColor =
                        piecePlacements[boardPlacementSquare]["piece_color"];
                    const pieceType =
                        piecePlacements[boardPlacementSquare]["piece_type"];

                    squareElements.push(
                        <Square
                            squareNumber={boardPlacementSquare}
                            squareColor={squareColor}
                            pieceColor={pieceColor}
                            pieceType={pieceType}
                            handleSquareClick={handleSquareClick}
                            setParsedFENString={setParsedFENString}
                            setDraggedSquare={setDraggedSquare}
                            setDroppedSquare={setDroppedSquare}
                        />
                    );
                } else {
                    squareElements.push(
                        <Square
                            squareNumber={boardPlacementSquare}
                            squareColor={squareColor}
                            handleSquareClick={handleSquareClick}
                            setParsedFENString={setParsedFENString}
                            setDraggedSquare={setDraggedSquare}
                            setDroppedSquare={setDroppedSquare}
                        />
                    );
                }
            }
        }

        return squareElements;
    }

    return <div className="chessboard-container">{generateChessboard()}</div>;
}

export default Chessboard;
