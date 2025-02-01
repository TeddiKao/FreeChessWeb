import React, { useState, useEffect } from "react";
import { fetchFen } from "../../utils/apiUtils.js";

import "../../globalComponents/chessboards/Chessboard.jsx";
import "../../globalComponents/modals/GameOverModal.jsx"

function PassAndPlay() {
    const [parsedFEN, setParsedFEN] = useState(null);

    const [gameEnded, setGameEnded] = useState(false);
    const [gameEndedCause, setGameEndedCause] = useState(null);
    const [gameWinner, setGameWinner] = useState(null);

    useEffect(() => {
        getParsedFEN();
    }, []);

    const startingPositionFEN =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    async function getParsedFEN() {
        try {
            const fetchedFEN = await fetchFen(startingPositionFEN);
            setParsedFEN(fetchedFEN);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <GameEndedSetterContext.Provider value={setGameEnded}>
            <GameEndedCauseSetterContext.Provider value={setGameEndedCause}>
                <GameWinnerSetterContext.Provider value={setGameWinner}>
                    <div className="playing-interface-container">
                        <Chessboard
                            parsed_fen_string={parsedFEN}
                            orientation="White"
                        />
                        <GameOverModal
                            visible={gameEnded}
                            gameEndCause={gameEndedCause}
                            gameWinner={gameWinner}
                        />
                    </div>
                </GameWinnerSetterContext.Provider>
            </GameEndedCauseSetterContext.Provider>
        </GameEndedSetterContext.Provider>
    );
}

export default PassAndPlay;
