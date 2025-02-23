import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import MultiplayerChessboard from "../../globalComponents/chessboards/MultiplayerChessboard.js";
import Timer from "../../pageComponents/gameplay/Ti"

import {
    GameEndedSetterContext,
    GameEndedCauseSetterContext,
    GameWinnerSetterContext,
} from "../../contexts/chessboardContexts.js";

import "../../styles/multiplayer/play.css";
import "../../styles/chessboard/board-actions.css";

import { fetchFen } from "../../utils/apiUtils.js";

import GameOverModal from "../../globalComponents/modals/GameOverModal.js";
import GameplaySettings from "../../globalComponents/modals/GameplaySettings.js";
import ModalWrapper from "../../globalComponents/wrappers/ModalWrapper.js";
function Play() {
    const [parsedFEN, setParsedFEN] = useState(null);
    const location = useLocation();

    const [gameEnded, setGameEnded] = useState(false);
    const [gameEndedCause, setGameEndedCause] = useState(null);
    const [gameWinner, setGameWinner] = useState(null);

    const [whitePlayerTimer, setWhitePlayerTimer] = useState(
        location.state?.baseTime
    );
    const [blackPlayerTimer, setBlackPlayerTimer] = useState(
        location.state?.baseTime
    );

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

    const topTimerColor = getTimerColor("top");
    const bottomTimerColor = getTimerColor("bottom");

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

    function handleSettingsClose() {
        setSettingsVisible(false);
    }

    function getTimerColor(timerPosition) {
        const boardSide =
            boardOrientation.toLowerCase() === "white" ? "bottom" : "top";
        const position = timerPosition.toLowerCase();

        if (boardSide === "bottom") {
            return position === "top" ? "black" : "white";
        } else {
            return position === "top" ? "white" : "black";
        }
    }

    function getTimeAmount(color) {
        if (color.toLowerCase() === "white") {
            return whitePlayerTimer;
        } else {
            return blackPlayerTimer;
        }
    }

    return (
        <GameEndedSetterContext.Provider value={setGameEnded}>
            <GameEndedCauseSetterContext.Provider value={setGameEndedCause}>
                <GameWinnerSetterContext.Provider value={setGameWinner}>
                    <div className="playing-interface-container">
                        <div className="main-chessboard">
                            <div className="top-timer-wrapper">
                                <Timer
                                    playerColor={topTimerColor}
                                    position="top"
                                    timeInSeconds={getTimeAmount(topTimerColor)}
                                />
                            </div>

                            <div className="chessboard-info">
                                <MultiplayerChessboard
                                    parsed_fen_string={parsedFEN}
                                    orientation={boardOrientation}
                                    gameId={gameId}
                                    setWhiteTimer={setWhitePlayerTimer}
                                    setBlackTimer={setBlackPlayerTimer}
                                />
                            </div>

                            <GameOverModal
                                visible={gameEnded}
                                gameEndCause={gameEndedCause}
                                gameWinner={gameWinner}
                            />

                            <ModalWrapper visible={settingsVisible}>
                                <GameplaySettings
                                    onClose={handleSettingsClose}
                                />
                            </ModalWrapper>

                            <div className="bottom-timer-wrapper">
                                <Timer
                                    playerColor={bottomTimerColor}
                                    position="bottom"
                                    timeInSeconds={getTimeAmount(
                                        bottomTimerColor
                                    )}
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

export default Play;
