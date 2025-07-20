import { useEffect, useRef, useState } from "react";
import "@gameplay/bot/styles/play-bot.scss";
import useGameplaySettings from "@settings/gameplay/hooks/useGameplaySettings";
import GameplaySettings from "@settings/gameplay/GameplaySettings";
import BaseModal from "@sharedComponents/layout/BaseModal";
import { Navigate, useLocation } from "react-router-dom";
import usePieceAnimation from "@sharedHooks/usePieceAnimation";
import LocalGameOverModal from "../../passAndPlay/modals/GameOverModal";
import DashboardNavbar from "@sharedComponents/DashboardNavbar/DashboardNavbar";
import MoveListPanel from "@sharedComponents/chessElements/gameplaySidePanel/MoveListPanel";
import MoveNavigationButtons from "@sharedComponents/chessElements/gameplaySidePanel/MoveNavigationButtons";
import BotChessboard from "../components/BotChessboard";
import BoardActions from "@sharedComponents/chessboard/BoardActions";
import { OptionalValue } from "@sharedTypes/utility.types";
import useBotGameplayLogic from "../hooks/useBotGameplayLogic";

function PlayBot() {
    const location = useLocation();
    const gameId = location.state?.gameId;
    const bot = location.state?.bot;
    const assignedColor = location.state?.assignedColor;

    const initialGameplaySettings = useGameplaySettings();
    const [gameplaySettings, setGameplaySettings] = useState<any>(
        initialGameplaySettings
    );
    const [gameplaySettingsVisible, setGameplaySettingsVisible] =
        useState<boolean>(false);

    const previousPositionIndexRef = useRef<OptionalValue<number>>(null);

    const {
        clickedSquare,
        setClickedSquare,
        prevClickedSquare,
        setPrevClickedSquare,
        draggedSquare,
        setDraggedSquare,
        droppedSquare,
        setDroppedSquare,

        gameStateHistory: {
            positionList,
            setPositionList,
            positionIndex,
            setPositionIndex,
            moveList,
            setMoveList,
        },

        parsedFEN,
        previousDraggedSquare,
        previousDroppedSquare,

        hasGameEnded,
        setHasGameEnded,
        gameWinner,
        setGameWinner,
        gameEndedCause,
        setGameEndedCause,

        handleCheckmate,
        handleDraw,

        cancelPromotion,
        handlePromotionPieceSelected,
        promotionSquare,
        shouldShowPromotionPopup,
        prePromotionBoardState,
    } = useBotGameplayLogic({ gameId });

    const [
        pieceAnimationSquare,
        pieceAnimationStyles,
    ] = usePieceAnimation();

    const [boardOrientation, setBoardOrientation] =
        useState<string>(assignedColor);

    useEffect(() => {
        setGameplaySettings(initialGameplaySettings);
    }, [initialGameplaySettings]);

    if (!location.state) {
        return <Navigate to="/select-bot" />;
    }

    function toggleBoardOrientation() {
        const newOrientation =
            boardOrientation.toLowerCase() === "white" ? "Black" : "White";
        setBoardOrientation(newOrientation);
    }

    function handleSettingsDisplay() {
        setGameplaySettingsVisible(true);
    }

    function handleSettingsModalClose() {
        setGameplaySettingsVisible(false);
    }

    if (!parsedFEN) {
        return null;
    }

    return (
        <>
            <DashboardNavbar />
            <div className="play-bot-interface-container">
                <div className="bot-chessboard-wrapper">
                    <BotChessboard
                        handleCheckmate={handleCheckmate}
                        handleDraw={handleDraw}
                        lastDraggedSquare={previousDraggedSquare}
                        lastDroppedSquare={previousDroppedSquare}
                        squareSize={58}
                        setPositionList={setPositionList}
                        setPositionIndex={setPositionIndex}
                        parsed_fen_string={prePromotionBoardState ?? parsedFEN}
                        orientation={boardOrientation}
                        gameplaySettings={gameplaySettings}
                        gameId={gameId}
                        setMoveList={setMoveList}
                        botId={bot}
                        setGameEnded={setHasGameEnded}
                        setGameWinner={setGameWinner}
                        setGameEndedCause={setGameEndedCause}
                        // @ts-ignore
                        parentAnimationSquare={pieceAnimationSquare}
                        // @ts-ignore
                        parentAnimationStyles={pieceAnimationStyles}
                        clickedSquaresState={{
                            prevClickedSquare,
                            clickedSquare,
                            setPrevClickedSquare,
                            setClickedSquare,
                        }}
                        dragAndDropSquaresState={{
                            draggedSquare,
                            droppedSquare,
                            setDraggedSquare,
                            setDroppedSquare,
                        }}
                        cancelPromotion={cancelPromotion}
                        handlePawnPromotion={handlePromotionPieceSelected}
                        promotionSquare={promotionSquare}
                        shouldShowPromotionPopup={shouldShowPromotionPopup}
                    />
                </div>

                <BoardActions
                    toggleBoardOrientation={toggleBoardOrientation}
                    displaySettings={handleSettingsDisplay}
                />

                <div className="gameplay-side-panel">
                    <MoveListPanel
                        moveList={moveList}
                        setPositionIndex={setPositionIndex}
                        gameWinner={gameWinner}
                        gameEnded={hasGameEnded}
                    />

                    <MoveNavigationButtons
                        previousPositionIndexRef={previousPositionIndexRef}
                        setPositionIndex={setPositionIndex}
                        positionListLength={positionList.length}
                    />
                </div>
            </div>

            <BaseModal visible={gameplaySettingsVisible}>
                <GameplaySettings
                    onClose={handleSettingsModalClose}
                    setGameplaySettings={setGameplaySettings}
                />
            </BaseModal>

            <LocalGameOverModal
                gameEndCause={gameEndedCause}
                gameWinner={gameWinner}
                visible={hasGameEnded}
            />
        </>
    );
}

export default PlayBot;
