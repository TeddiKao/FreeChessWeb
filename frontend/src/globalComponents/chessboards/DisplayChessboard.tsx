import { DisplayChessboardProps } from "../../interfaces/chessboard";
import "../../styles/chessboard/chessboard.css";



function DisplayChessboard({ parsed_fen_string, orientation }: DisplayChessboardProps) {
    if (!parsed_fen_string) {
        return null;
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
                const boardPlacement = parsed_fen_string["board_placement"];
                const squaresArray = Object.keys(boardPlacement);

                const file = square - startingIndex + 1;
                const squareIsLight = (file + row) % 2 !== 0;

                const squareColor = squareIsLight ? "light" : "dark";

                if (squaresArray.includes(`${square - 1}`)) {
                    const pieceType =
                        boardPlacement[`${square - 1}`]["piece_type"];
                    const pieceColor =
                        boardPlacement[`${square - 1}`][
                            "piece_color"
                        ].toLowerCase();

                    squareElements.push(
                        <div
                            key={square}
                            id={`${square}`}
                            className={`chessboard-square ${squareColor}`}
                        >
                            <img
                                src={`/${pieceColor}${pieceType}.svg`}
                                className="piece-image"
                            />
                        </div>
                    );
                } else {
                    squareElements.push(
                        <div
                            key={square}
                            id={`${square}`}
                            className={`chessboard-square ${squareColor}`}
                        ></div>
                    );
                }
            }
        }

        return squareElements;
    }

    return <div className="chessboard-container">{generateChessboard()}</div>;
}

export default DisplayChessboard;
