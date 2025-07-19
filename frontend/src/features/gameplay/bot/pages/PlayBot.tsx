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
import { MoveInfo, ParsedFEN } from "@sharedTypes/chessTypes/gameState.types";
import {
    fetchBotGamePositionList,
    fetchBotGameMoveList,
} from "../botGameApiService";
import BoardActions from "@sharedComponents/chessboard/BoardActions";
import { ChessboardSquareIndex } from "@sharedTypes/chessTypes/board.types";
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

    const [gameWinner, setGameWinner] = useState<string>("");
    const [hasGameEnded, setHasGameEnded] = useState(false);
    const [gameEndedCause, setGameEndedCause] = useState<string>("");

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
        },

        parsedFEN,
        previousDraggedSquare,
        previousDroppedSquare,
    } = useBotGameplayLogic({ gameId });

    const [
        pieceAnimationSquare,
        pieceAnimationStyles,
        animatePiece,
        animateMoveReplay,
    ] = usePieceAnimation();

    const [moveList, setMoveList] = useState<Array<Array<string>>>([]);

    const [boardOrientation, setBoardOrientation] =
        useState<string>(assignedColor);

    useEffect(() => {
        updateMoveList();
        updatePositionList();
    }, [gameId]);

    useEffect(() => {
        setGameplaySettings(initialGameplaySettings);
    }, [initialGameplaySettings]);

    if (!location.state) {
        return <Navigate to="/select-bot" />;
    }

    async function updatePositionList() {
        const positionList = await fetchBotGamePositionList(gameId);

        setPositionList(positionList);
    }

    async function updateMoveList() {
        const moveList = await fetchBotGameMoveList(gameId);

        setMoveList(moveList);
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
                        lastDraggedSquare={previousDraggedSquare}
                        lastDroppedSquare={previousDroppedSquare}
                        squareSize={58}
                        setPositionList={setPositionList}
                        setPositionIndex={setPositionIndex}
                        parsed_fen_string={parsedFEN}
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
