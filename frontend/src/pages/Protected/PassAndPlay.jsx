import React, { useState, useEffect } from "react";
import { fetchFen } from "../../utils/apiUtils.js";

import {
    GameEndedSetterContext,
    GameEndedCauseSetterContext,
    GameWinnerSetterContext,
} from "../../contexts/chessboardContexts.js";

import "../../styles/pass-and-play.css";
import "../../styles/chessboard/board-actions.css"

import Chessboard from "../../globalComponents/chessboards/Chessboard.jsx";
import GameOverModal from "../../globalComponents/modals/GameOverModal.jsx";
import GameplaySettings from "../../globalComponents/modals/GameplaySettings.jsx";
import ModalWrapper from "../../globalComponents/wrappers/ModalWrapper.jsx";

function PassAndPlay() {
    const [parsedFEN, setParsedFEN] = useState(null);

    const [gameEnded, setGameEnded] = useState(false);
    const [gameEndedCause, setGameEndedCause] = useState(null);
    const [gameWinner, setGameWinner] = useState(null);

    const [gameplaySettingsVisible, setGameplaySettingsVisible] =
        useState(false);

    const [boardOrientation, setBoardOrientation] = useState("White");

    useEffect(() => {
        getParsedFEN();
    }, []);

    function handleSettingsClose() {
        setGameplaySettingsVisible(false);
    }

    function handleSettingsDisplay() {
        setGameplaySettingsVisible(true);
    }

    function toggleBoardOrientation() {
        const isWhite = boardOrientation.toLowerCase() === "white";
        const newOrientation = isWhite ? "Black" : "White";

        setBoardOrientation(newOrientation);
    }

    const startingPositionFEN =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 11";

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
                        <div className="main-chessboard">
                            <div className="chessboard-wrapper">
                                <Chessboard
                                    parsed_fen_string={parsedFEN}
                                    boardOrientation={boardOrientation}
                                    setBoardOrientation={setBoardOrientation}
                                    flipOnMove={false}
                                />
                            </div>

                            <ModalWrapper visible={gameplaySettingsVisible}>
                                <GameplaySettings
                                    onClose={handleSettingsClose}
                                />
                            </ModalWrapper>

                            <GameOverModal
                                visible={gameEnded}
                                gameEndCause={gameEndedCause}
                                gameWinner={gameWinner}
                            />
                        </div>

                        <div className="board-actions">
                            <img
                                onClick={toggleBoardOrientation}
                                className="flip-board-icon"
                                src="/flip-board-icon.png"
                            />
                            <img
                                className="settings-icon"
                                src="/settings.svg"
                                onClick={handleSettingsDisplay}
                            />
                        </div>
                    </div>
                </GameWinnerSetterContext.Provider>
            </GameEndedCauseSetterContext.Provider>
        </GameEndedSetterContext.Provider>
    );
}

export default PassAndPlay;
