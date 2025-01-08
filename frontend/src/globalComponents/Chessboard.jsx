import "../styles/chessboard.css"

function Chessboard() {
    function generateChessboard() {
		const squareElements = [];

        for (let square = 1; square <= 64; square++) {
            // Square 1 is in the top left corner
            const currentRank = 8 - Math.ceil(square / 8);

            // On odd ranks, odd number = light square, even number = dark square
            const rankIsEven = currentRank % 2 === 0;
            const squareIsEven = square % 2 === 0;

            const squareColor =
                (rankIsEven && squareIsEven) || (!rankIsEven && !squareIsEven)
                    ? "light"
                    : "dark";

			squareElements.push(
				<div key={square} id={square} className={`chessboard-square ${squareColor}`}></div>
			)
        }

		return squareElements
    }

    return <div className="chessboard-container">{generateChessboard()}</div>;
}

export default Chessboard;
