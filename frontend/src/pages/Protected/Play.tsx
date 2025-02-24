import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import MultiplayerChessboard from "../../globalComponents/chessboards/MultiplayerChessboard.js";
import Timer from "../../pageComponents/gameplay/Timer.tsx";

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
import { OptionalValue } from "../../types/general.js";
import { ParsedFENString, PieceColor } from "../../types/gameLogic.js";
import useGameplaySettings from "../../hooks/useGameplaySettings.ts";
function Play() {
    const [parsedFEN, setParsedFEN] =
        useState<OptionalValue<ParsedFENString>>(null);
    const location = useLocation();

    const [gameEnded, setGameEnded] = useState<boolean>(false);
    const [gameEndedCause, setGameEndedCause] =
        useState<OptionalValue<string>>(null);
    const [gameWinner, setGameWinner] = useState<OptionalValue<string>>(null);

    const [whitePlayerTimer, setWhitePlayerTimer] = useState<
        OptionalValue<number>
    >(location.state?.baseTime);
    const [blackPlayerTimer, setBlackPlayerTimer] = useState<
        OptionalValue<number>
    >(location.state?.baseTime);

    const [boardOrientation, setBoardOrientation] = useState(
        location.state?.assignedColor || "White"
    );

    const [settingsVisible, setSettingsVisible] = useState(false);

    const initialGameplaySettings = useGameplaySettings();
    const [gameplaySettings, setGameplaySettings] = useState(
        initialGameplaySettings
    );

    const startingPositionFEN =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    useEffect(() => {
        getParsedFEN();
    }, []);

    useEffect(() => {
        setGameplaySettings(initialGameplaySettings);
    }, [initialGameplaySettings]);

    if (!location.state) {
        return <Navigate to={"/select-time-control"} />;
    }

    if (!gameplaySettings) {
        return null;
    }

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

    function getTimerColor(timerPosition: string) {
        const boardSide =
            boardOrientation.toLowerCase() === "white" ? "bottom" : "top";
        const position = timerPosition.toLowerCase();

        if (boardSide === "bottom") {
            return position === "top" ? "black" : "white";
        } else {
            return position === "top" ? "white" : "black";
        }
    }

    function getTimeAmount(color: PieceColor) {
        if (color === "white") {
            return whitePlayerTimer;
        } else {
            return blackPlayerTimer;
        }
    }

    const topTimerAmount = getTimeAmount(topTimerColor);
    const bottomTimerAmount = getTimeAmount(bottomTimerColor);

    if (!topTimerAmount || !bottomTimerAmount) {
        return <Navigate to="/select-time-control" />;
    }

    if (!parsedFEN) {
        return null;
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
                                    timeInSeconds={topTimerAmount}
                                />
                            </div>

                            <div className="chessboard-info">
                                <MultiplayerChessboard
                                    parsed_fen_string={parsedFEN}
                                    orientation={boardOrientation}
                                    gameId={gameId}
                                    setWhiteTimer={setWhitePlayerTimer}
                                    setBlackTimer={setBlackPlayerTimer}
                                    gameplaySettings={gameplaySettings}
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
                                    setGameplaySettings={setGameplaySettings}
                                />
                            </ModalWrapper>

                            <div className="bottom-timer-wrapper">
                                <Timer
                                    playerColor={bottomTimerColor}
                                    timeInSeconds={bottomTimerAmount}
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
