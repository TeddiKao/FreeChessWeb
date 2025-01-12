import { useState, useEffect } from "react";

import api from "../api.js";

import "../styles/chessboard.css";
import Square from "./Square";

function Chessboard({ parsed_fen_string, orientation }) {
    const [previousClickedSquare, setPreviousClickedSquare] = useState(null);
    const [clickedSquare, setClickedSquare] = useState(null);
    const [parsedFENString, setParsedFENString] = useState(parsed_fen_string);

    const [draggedSquare, setDraggedSquare] = useState(null);
    const [droppedSquare, setDroppedSquare] = useState(null);

    const [legalSquares, setLegalSquares] = useState([]);

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
        if (!(draggedSquare && droppedSquare)) {
            setDraggedSquare(null);
            setDroppedSquare(null);

            return;
        }

        if (draggedSquare === droppedSquare) {
            setDraggedSquare(null);
            setDroppedSquare(null);

            return;
        }

        let moveIsLegal = null;

        const boardPlacementToValidate = parsedFENString["board_placement"];
        const squareInfoToValidate =
            boardPlacementToValidate[`${draggedSquare}`];

        const pieceTypeToValidate = squareInfoToValidate["piece_type"];
        const pieceColorToValidate = squareInfoToValidate["piece_color"];

        try {
            const response = await api
                .post("/gameplay_api/validate-move/", {
                    parsed_fen_string: parsedFENString,
                    move_info: {
                        piece_color: pieceColorToValidate,
                        piece_type: pieceTypeToValidate,
                        starting_square: `${draggedSquare}`,
                        destination_square: `${droppedSquare}`,
                    },
                })
                .catch(() => {
                    setDraggedSquare(null);
                    setDroppedSquare(null);

                    return;
                });

            if (response.status === 200) {
                moveIsLegal = response.data.is_valid;
            }
        } catch (error) {
            console.log(error);
            setDraggedSquare(null);
            setDroppedSquare(null);

            return;
        }

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

            const newPiecePlacements = {
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

            return newPiecePlacements;
        });
    }

    async function handleClickToMove() {
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

        let isMoveLegal = null;

        try {
            const response = await api
                .post("/gameplay_api/validate-move/", {
                    parsed_fen_string: parsedFENString,
                    move_info: {
                        piece_color: pieceColorToValidate,
                        piece_type: pieceTypeToValidate,
                        starting_square: `${previousClickedSquare}`,
                        destination_square: `${clickedSquare}`,
                    },
                })
                .catch(() => {
                    setClickedSquare(null);
                    setPreviousClickedSquare(null);
                });

            if (response.status === 200) {
                isMoveLegal = response.data.is_valid;
            }
        } catch (error) {
            console.log(error);
        }

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

            const newBoardPlacements = {
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

            return newBoardPlacements;
        });

        setPreviousClickedSquare(null);
        setClickedSquare(null);
    }

    async function displayLegalMoves(pieceType, pieceColor, currentSquare) {
        try {
            const response = await api.post("/gameplay_api/show-legal-moves/", {
                parsed_fen_string: parsedFENString,
                move_info: {
                    piece_color: pieceColor,
                    piece_type: pieceType,
                    starting_square: currentSquare,
                },
            });

            if (response.status === 200) {
                // TODO: Make all legal move squares blue
                for (const square of response.data) {
                    const squareElement = document.getElementById(square);
                    squareElement.classList.add("legal-square");
                }
            }
        } catch (error) {
            console.log(error);
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

                // On odd ranks, odd number = light square, even number = dark square
                const squareIsEven = (file + row) % 2 === 0;

                const squareColor = squareIsEven ? "dark" : "light";

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
