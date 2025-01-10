import { useState, useEffect } from "react";

import "../styles/chessboard.css";
import Square from "./Square";

function Chessboard({ parsed_fen_string, orientation }) {
    const [previousClickedSquare, setPreviousClickedSquare] = useState(null);
    const [clickedSquare, setClickedSquare] = useState(null);
    const [parsedFENString, setParsedFENString] = useState(parsed_fen_string);

    useEffect(() => {
        setParsedFENString(parsed_fen_string);
    }, [parsed_fen_string]);

    useEffect(() => {
        if (previousClickedSquare && clickedSquare) {
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
    }, [previousClickedSquare, clickedSquare]);

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

        const startingIndex = orientation === "White" ? 64 : 1;
        const endingIndex = orientation === "White" ? 1 : 64;

        for (
            let square = startingIndex;
            orientation === "White"
                ? square >= endingIndex
                : square <= endingIndex;
            orientation === "White" ? square-- : square++
        ) {
            // Square 1 is in the top left corner
            const currentRank = 8 - Math.ceil(square / 8);

            // On odd ranks, odd number = light square, even number = dark square
            const rankIsEven = currentRank % 2 === 0;
            const squareIsEven = square % 2 === 0;

            const squareColor =
                (rankIsEven && squareIsEven) || (!rankIsEven && !squareIsEven)
                    ? "light"
                    : "dark";

            const boardPlacementSquare = `${square - 1}`;
            if (Object.keys(piecePlacements).includes(boardPlacementSquare)) {
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
                    />
                );
            } else {
                squareElements.push(
                    <Square
                        squareNumber={boardPlacementSquare}
                        squareColor={squareColor}
                        handleSquareClick={handleSquareClick}
                        setParsedFENString={setParsedFENString}
                    />
                );
            }
        }

        return squareElements;
    }

    return <div className="chessboard-container">{generateChessboard()}</div>;
}

export default Chessboard;
