import { Navigate, useLocation } from "react-router-dom";

import MultiplayerChessboard from "../../globalComponents/chessboards/MultiplayerChessboard.jsx";
import Timer from "../../pageComponents/gameplay/Timer.jsx";

import {
    GameEndedSetterContext,
    GameEndedCauseSetterContext,
    GameWinnerSetterContext,
} from "../../contexts/chessboardContexts.js";

import "../../styles/multiplayer/play.css";
import "../../styles/chessboard/board-actions.css";

import { fetchFen } from "../../utils/apiUtils.js";

import React, { useEffect, useState } from "react";
import GameOverModal from "../../globalComponents/modals/GameOverModal.jsx";
import GameplaySettings from "../../globalComponents/modals/GameplaySettings.jsx";
function Play() {
    const [parsedFEN, setParsedFEN] = useState(null);
    const location = useLocation();

    const [gameEnded, setGameEnded] = useState(false);
    const [gameEndedCause, setGameEndedCause] = useState(null);
    const [gameWinner, setGameWinner] = useState(null);

    const [boardOrientation, setBoardOrientation] = useState(
        location.state?.assignedColor || "White"
    );
    
    const [settingsVisible, setSettingsVisible] = useState(false);

    const startingPositionFEN =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    useEffect(() => {
        getParsedFEN();
    }, []);

    if (!location.state) {
        return <Navigate to={"/select-time-control"} />;
    }

    const timeControlBaseTime = location.state.baseTime;
    const timeControlIncrement = location.state.increment;
    const gameId = location.state.gameId;
    const assignedColor = location.state.assignedColor;

    async function getParsedFEN() {
        try {
            const fetchedFEN = await fetchFen(startingPositionFEN);
            setParsedFEN(fetchedFEN);
        } catch (error) {
            console.log(error);
        }
    }

    function handleSettingsDisplay() {
        setSettingsVisible(true);
    }

    function toggleBoardOrientation() {
        const isWhite = boardOrientation.toLowerCase() === "white";
        const newOrientation = isWhite ? "Black" : "White";
        
        setBoardOrientation(newOrientation);
    }

    return (
        <GameEndedSetterContext.Provider value={setGameEnded}>
            <GameEndedCauseSetterContext.Provider value={setGameEndedCause}>
                <GameWinnerSetterContext.Provider value={setGameWinner}>
                    <div className="playing-interface-container">
                        <div className="main-chessboard">
                            <div className="top-timer-wrapper">
                                <Timer
                                    playerColor="black"
                                    position="top"
                                    timeInSeconds={timeControlBaseTime}
                                />
                            </div>

                            <div className="chessboard-info">
                                <MultiplayerChessboard
                                    parsed_fen_string={parsedFEN}
                                    orientation={boardOrientation}
                                    gameId={gameId}
                                />
                            </div>

                            <GameOverModal
                                visible={gameEnded}
                                gameEndCause={gameEndedCause}
                                gameWinner={gameWinner}
                            />

                            <GameplaySettings />

                            <div className="bottom-timer-wrapper">
                                <Timer
                                    playerColor="white"
                                    position="bottom"
                                    timeInSeconds={timeControlBaseTime}
                                />
                            </div>
                        </div>

                        <div className="board-actions">
                            <img
                                onClick={toggleBoardOrientation}
                                className="flip-board-icon"
                                src="/flip-board-icon.png"
                            />
                            <img
                                className="settings-icon"
                                onClick={handleSettingsDisplay}
                            />
                        </div>
                    </div>
                </GameWinnerSetterContext.Provider>
            </GameEndedCauseSetterContext.Provider>
        </GameEndedSetterContext.Provider>
    );
}

export default Play;
