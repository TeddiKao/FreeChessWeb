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

import { fetchFen, fetchMoveList, fetchPositionList, fetchTimer } from "../../utils/apiUtils.ts";

import GameOverModal from "../../globalComponents/modals/GameOverModal.js";
import GameplaySettings from "../../globalComponents/modals/GameplaySettings.js";
import ModalWrapper from "../../globalComponents/wrappers/ModalWrapper.js";
import { OptionalValue } from "../../types/general.js";
import { ParsedFENString, PieceColor } from "../../types/gameLogic.js";
import useGameplaySettings from "../../hooks/useGameplaySettings.ts";
import MoveListPanel from "../../globalComponents/MoveListPanel.tsx";

function Play() {
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

    const [positionList, setPositionList] = useState<Array<{
        position: ParsedFENString,
        last_dragged_square: string,
        last_dropped_square: string,
    }>>([]);
    const [positionIndex, setPositionIndex] = useState<number>(0);

    const [moveList, setMoveList] = useState<Array<Array<string>>>([]);

    const parsedFEN = positionList[positionIndex]?.["position"];
    const lastDraggedSquare = positionList[positionIndex]?.["last_dragged_square"]
    const lastDroppedSquare = positionList[positionIndex]?.["last_dropped_square"];

    const [boardOrientation, setBoardOrientation] = useState(
        location.state?.assignedColor || "White"
    );

    const [settingsVisible, setSettingsVisible] = useState(false);

    const initialGameplaySettings = useGameplaySettings();
    const [gameplaySettings, setGameplaySettings] = useState(
        initialGameplaySettings
    );

    useEffect(() => {
        updatePlayerTimers();
        updatePositionList();
        updateMoveList();
    }, []);

    useEffect(() => {
        console.log("Position list updated");
        console.log(positionList);
    }, [positionList]);

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "ArrowLeft") {
            setPositionIndex((prevIndex) => {
                return prevIndex > 0? prevIndex - 1 : prevIndex;
            })
        } else if (event.key === "ArrowRight") {
            console.log(positionList);

            setPositionIndex((prevIndex) => {
                return prevIndex + 1 < positionList.length ? prevIndex + 1 : prevIndex;
            })
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [positionList]);

    useEffect(() => {
        setGameplaySettings(initialGameplaySettings);
    }, [initialGameplaySettings]);

    if (!location.state) {
        return <Navigate to={"/game-setup"} />;
    }

    if (!gameplaySettings) {
        return null;
    }

    const gameId = location.state?.gameId;

    const topTimerColor = getTimerColor("top");
    const bottomTimerColor = getTimerColor("bottom");

    function handleSettingsDisplay() {
        setSettingsVisible(true);
    }

    async function updatePlayerTimers(): Promise<void> {
        const whitePlayerTimer = await fetchTimer(
            Number(location.state?.gameId),
            "white"
        );
        const blackPlayerTimer = await fetchTimer(
            Number(location.state?.gameId),
            "black"
        );

        console.log(whitePlayerTimer, blackPlayerTimer);

        setWhitePlayerTimer(whitePlayerTimer);
        setBlackPlayerTimer(blackPlayerTimer);
    }

    async function updatePositionList(): Promise<void> {
        if (!location.state?.gameId) {
            return;
        }

        const positionList = await fetchPositionList(Number(location.state?.gameId))

        setPositionList(positionList);
    }

    async function updateMoveList(): Promise<void> {
        if (!location.state?.gameId) {
            return;
        }

        const moveList = await fetchMoveList(Number(location.state?.gameId))

        setMoveList(moveList);
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
        return <Navigate to="/game-setup" />;
    }

    if (!parsedFEN) {
        return null;
    }

    return (
        <GameEndedSetterContext.Provider value={setGameEnded}>
            <GameEndedCauseSetterContext.Provider value={setGameEndedCause}>
                <GameWinnerSetterContext.Provider value={setGameWinner}>
                    <div className="multiplayer-playing-interface-container">
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
                                    setMoveList={setMoveList}
                                    setWhiteTimer={setWhitePlayerTimer}
                                    setBlackTimer={setBlackPlayerTimer}
                                    setPositionIndex={setPositionIndex}
                                    setPositionList={setPositionList}
                                    gameplaySettings={gameplaySettings}
                                    lastDraggedSquare={lastDraggedSquare}
                                    lastDroppedSquare={lastDroppedSquare}
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

                        <MoveListPanel moveList={moveList} />
                    </div>
                </GameWinnerSetterContext.Provider>
            </GameEndedCauseSetterContext.Provider>
        </GameEndedSetterContext.Provider>
    );
}

export default Play;
