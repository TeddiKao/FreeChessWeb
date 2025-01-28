import { Navigate, useLocation } from "react-router-dom";

import Chessboard from "../../globalComponents/chessboards/Chessboard.jsx";
import Timer from "../../pageComponents/gameplay/Timer.jsx";

import {
    GameEndedSetterContext,
    GameEndedCauseSetterContext,
    GameWinnerSetterContext,
} from "../../contexts/chessboardContexts.js";

import "../../styles/play.css";

import { fetchFen } from "../../utils/apiUtils.js";

import React, { useEffect, useState } from "react";
import GameOverModal from "../../globalComponents/modals/GameOverModal.jsx";

function Play() {
    const [parsedFEN, setParsedFEN] = useState(null);
    const location = useLocation();

    const [gameEnded, setGameEnded] = useState(false);
    const [gameEndedCause, setGameEndedCause] = useState(null);
    const [gameWinner, setGameWinner] = useState(null);

    useEffect(() => {
        console.log("Game status changed");
        console.log(gameEnded, gameEndedCause, gameWinner);
    }, [gameEnded, gameEnded, gameWinner]);

    useEffect(() => {
        getParsedFEN();
    }, []);

    if (!location.state) {
        return <Navigate to={"/select-time-control"} />;
    }

    const timeControlBaseTime = location.state.baseTime;
    const timeControlIncrement = location.state.increment;

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
                        <div className="top-timer-wrapper">
                            <Timer
                                playerColor="black"
                                position="top"
                                timeInSeconds={timeControlBaseTime}
                            />
                        </div>

                        <Chessboard
                            parsed_fen_string={parsedFEN}
                            orientation="White"
                        />
                        <GameOverModal
                            visible={gameEnded}
                            gameEndCause={gameEndedCause}
                            gameWinner={gameWinner}
                        />

                        <div className="bottom-timer-wrapper">
                            <Timer
                                playerColor="white"
                                position="bottom"
                                timeInSeconds={timeControlBaseTime}
                            />
                        </div>
                    </div>
                </GameWinnerSetterContext.Provider>
            </GameEndedCauseSetterContext.Provider>
        </GameEndedSetterContext.Provider>
    );
}

export default Play;
