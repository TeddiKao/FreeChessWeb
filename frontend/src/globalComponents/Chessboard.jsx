import "../styles/chessboard.css";

function Chessboard({ parsed_fen_string, orientation }) {
    if (!parsed_fen_string) {
        return null;
    }

    const piecePlacements = parsed_fen_string["board_placement"]

    function generateChessboard() {
        const squareElements = [];

        const startingIndex = orientation === "White" ? 64 : 1;
        const endingIndex = orientation === "White" ? 1 : 64;

        for (
            let square = startingIndex;
            orientation === "White" ? square >= endingIndex : square <= endingIndex;
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
            if (
                Object.keys(piecePlacements).includes(boardPlacementSquare)
            ) {
                const pieceColor = piecePlacements[boardPlacementSquare]["piece_color"];
                const pieceType = piecePlacements[boardPlacementSquare]["piece_type"];

                squareElements.push(
                    <div className={`chessboard-square ${squareColor}`}>
                        <img
                            src={`../../public/${pieceColor.toLowerCase()}${pieceType}.svg`}
                        />
                    </div>
                );
            } else {
                squareElements.push(
                    <div
                        className={`chessboard-square ${squareColor}`}
                        id={square - 1}
                    ></div>
                );
            }
        }

        return squareElements;
    }

    return <div className="chessboard-container">{generateChessboard()}</div>;
}

export default Chessboard;
