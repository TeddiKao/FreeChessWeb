import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import MultiplayerChessboard from "../../globalComponents/chessboards/MultiplayerChessboard.js";
import Timer from "../../pageComponents/gameplay/Timer.tsx";

import "../../styles/pages/play.scss";
import "../../styles/components/chessboard/board-actions.scss";

import {
    fetchMoveList,
    fetchPositionList,
    fetchTimer,
} from "../../utils/apiUtils.ts";

import GameOverModal from "../../globalComponents/modals/GameOverModal.js";
import GameplaySettings from "../../globalComponents/modals/GameplaySettings.js";
import ModalWrapper from "../../globalComponents/wrappers/ModalWrapper.js";
import { OptionalValue } from "../../types/general.js";
import { ParsedFENString, PieceColor } from "../../types/gameLogic.js";
import useGameplaySettings from "../../hooks/useGameplaySettings.ts";
import MoveListPanel from "../../globalComponents/gameplaySidePanel/MoveListPanel.tsx";
import MoveNavigationButtons from "../../globalComponents/gameplaySidePanel/MoveNavigationButtons.tsx";
import { ArrowKeys } from "../../enums/general.ts";
import GameplayActionButtons from "../../globalComponents/gameplaySidePanel/GameplayActionButtons.tsx";
import { isNullOrUndefined } from "../../utils/generalUtils.ts";
import MessageBox from "../../globalComponents/popups/MessageBox.tsx";
import { MessageBoxTypes } from "../../types/messageBox.ts";
import DrawOfferPopup from "../../globalComponents/popups/DrawOfferPopup.tsx";
import { playAudio } from "../../utils/audioUtils.ts";

function Play() {
    const location = useLocation();

    const [whitePlayerTimer, setWhitePlayerTimer] = useState<
        OptionalValue<number>
    >(location.state?.baseTime);
    const [blackPlayerTimer, setBlackPlayerTimer] = useState<
        OptionalValue<number>
    >(location.state?.baseTime);

    const [positionList, setPositionList] = useState<
        Array<{
            position: ParsedFENString;
            last_dragged_square: string;
            last_dropped_square: string;
            move_type: string;
        }>
    >([]);
    const [positionIndex, setPositionIndex] = useState<number>(0);

    const [moveList, setMoveList] = useState<Array<Array<string>>>([]);

    const [hasGameEnded, setHasGameEnded] = useState<boolean>(false);
    const [gameEndedCause, setGameEndedCause] = useState<string>("");
    const [gameWinner, setGameWinner] = useState<string>("");

    const [messageBoxVisible, setMessageBoxVisible] = useState<boolean>(false);
    const [messageToDisplay, setMessageToDisplay] = useState<string>("");
    const [messageType, setMessageType] = useState<MessageBoxTypes>("info");

    const [drawOfferReceived, setDrawOfferReceived] = useState<boolean>(false);

    const parsedFEN = positionList[positionIndex]?.["position"];
    const lastDraggedSquare =
        positionList[positionIndex]?.["last_dragged_square"];
    const lastDroppedSquare =
        positionList[positionIndex]?.["last_dropped_square"];
    const moveType = positionList[positionIndex]?.["move_type"];

    const [boardOrientation, setBoardOrientation] = useState(
        location.state?.assignedColor || "White"
    );

    const [settingsVisible, setSettingsVisible] = useState(false);

    const initialGameplaySettings = useGameplaySettings();
    const [gameplaySettings, setGameplaySettings] = useState(
        initialGameplaySettings
    );

    const actionWebSocketRef = useRef(null);

    useEffect(() => {
        updatePlayerTimers();
        updatePositionList();
        updateMoveList();
    }, []);

    useEffect(() => {
        setPositionIndex(positionList.length - 1);
    }, [positionList]);

    useEffect(() => {
        if (!isNullOrUndefined(moveType)) {
            playAudio(moveType);
        }
    }, [positionIndex]);

    function handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case ArrowKeys.ARROW_LEFT:
                setPositionIndex((prevIndex) => {
                    return prevIndex > 0 ? prevIndex - 1 : prevIndex;
                });

                break;

            case ArrowKeys.ARROW_RIGHT:
                setPositionIndex((prevIndex) => {
                    return prevIndex + 1 < positionList.length
                        ? prevIndex + 1
                        : prevIndex;
                });

                break;

            case ArrowKeys.ARROW_UP:
                setPositionIndex(0);
                break;

            case ArrowKeys.ARROW_DOWN:
                setPositionIndex(positionList.length - 1);
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
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

        setWhitePlayerTimer(whitePlayerTimer);
        setBlackPlayerTimer(blackPlayerTimer);
    }

    async function updatePositionList(): Promise<void> {
        if (!location.state?.gameId) {
            return;
        }

        const positionList = await fetchPositionList(
            Number(location.state?.gameId)
        );

        setPositionList(positionList);
    }

    async function updateMoveList(): Promise<void> {
        if (!location.state?.gameId) {
            return;
        }

        const moveList = await fetchMoveList(Number(location.state?.gameId));

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

    function handleBackToStart() {
        setPositionIndex(0);
    }

    function handlePreviousMove() {
        setPositionIndex((prevIndex) =>
            prevIndex > 0 ? (prevIndex -= 1) : prevIndex
        );
    }

    function handleNextMove() {
        setPositionIndex((prevIndex) =>
            prevIndex + 1 < positionList.length ? prevIndex + 1 : prevIndex
        );
    }

    function handleCurrentPosition() {
        setPositionIndex(positionList.length - 1);
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

    if (
        isNullOrUndefined(topTimerAmount) ||
        isNullOrUndefined(bottomTimerAmount)
    ) {
        return <Navigate to="/game-setup" />;
    }

    if (!parsedFEN) {
        return null;
    }

    return (
        <>
            <div className="multiplayer-playing-interface-container">
                <div className="main-chessboard">
                    <div className="top-timer-wrapper">
                        <Timer
                            playerColor={topTimerColor}
                            timeInSeconds={topTimerAmount!}
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
                            setGameEnded={setHasGameEnded}
                            setGameEndedCause={setGameEndedCause}
                            setGameWinner={setGameWinner}
                            squareSize={58}
                        />
                    </div>

                    <GameOverModal
                        visible={hasGameEnded}
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
                            timeInSeconds={bottomTimerAmount!}
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

                <div className="gameplay-side-panel">
                    <MoveListPanel
                        moveList={moveList}
                        setPositionIndex={setPositionIndex}
                        gameWinner={gameWinner}
                        gameEnded={hasGameEnded}
                    />
                    
                    <MoveNavigationButtons
                        backToStart={handleBackToStart}
                        handlePreviousMove={handlePreviousMove}
                        handleNextMove={handleNextMove}
                        backToCurrentPosition={handleCurrentPosition}
                    />

                    <GameplayActionButtons
                        setGameEnded={setHasGameEnded}
                        setGameEndedCause={setGameEndedCause}
                        setGameWinner={setGameWinner}
                        gameId={gameId}
                        setMessagePopupVisible={setMessageBoxVisible}
                        setMessageToDisplay={setMessageToDisplay}
                        parentActionWebsocket={actionWebSocketRef}
                        setDrawOfferReceived={setDrawOfferReceived}
                    />
                </div>

                {messageBoxVisible && (
                    <MessageBox
                        setVisible={setMessageBoxVisible}
                        type={messageType}
                        text={messageToDisplay}
                        disappearAfterSeconds={3}
                        xAlignment="right"
                        yAlignment="bottom"
                    />
                )}
            </div>

            <DrawOfferPopup
                onClose={() => {
                    setDrawOfferReceived(false);
                }}
                visible={drawOfferReceived}
                actionWebsocketRef={actionWebSocketRef}
            />
        </>
    );
}

export default Play;
