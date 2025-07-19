import { useEffect, useRef, useState } from "react";
import "@gameplay/bot/styles/play-bot.scss";
import useGameplaySettings from "@settings/gameplay/hooks/useGameplaySettings";
import GameplaySettings from "@settings/gameplay/GameplaySettings";
import BaseModal from "@sharedComponents/layout/BaseModal";
import { Navigate, useLocation } from "react-router-dom";
import { isNullOrUndefined } from "@sharedUtils/generalUtils";
import { playAudio } from "@sharedUtils/audioUtils";
import { convertToMilliseconds } from "@sharedUtils/timeUtils";
import { pieceAnimationTime } from "@sharedConstants/pieceAnimation";
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

    const [positionList, setPositionList] = useState<
        Array<{
            position: ParsedFEN;
            move_type: string;
            last_dragged_square: ChessboardSquareIndex;
            last_dropped_square: ChessboardSquareIndex;
            move_info: MoveInfo;
        }>
    >([]);

    const previousPositionIndexRef = useRef<OptionalValue<number>>(null);
    const [positionIndex, setPositionIndex] = useState<number>(
        positionList.length - 1
    );
    const [parsedFEN, setParsedFEN] = useState(
        positionList[positionIndex]?.["position"]
    );
    const [lastDraggedSquare, setLastDraggedSquare] = useState(
        positionList[positionIndex]?.["last_dragged_square"]
    );
    const [lastDroppedSquare, setLastDroppedSquare] = useState(
        positionList[positionIndex]?.["last_dropped_square"]
    );

    const {
        clickedSquare,
        setClickedSquare,
        prevClickedSquare,
        setPrevClickedSquare,
        draggedSquare,
        setDraggedSquare,
        droppedSquare,
        setDroppedSquare,
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
        const animationTimeout = setTimeout(() => {
            setPositionIndex(positionList.length - 1);
            setParsedFEN(positionList[positionIndex]?.["position"]);
            setLastDraggedSquare(
                positionList[positionIndex]?.["last_dragged_square"]
            );
            setLastDroppedSquare(
                positionList[positionIndex]?.["last_dropped_square"]
            );
        }, convertToMilliseconds(pieceAnimationTime));

        return () => {
            clearTimeout(animationTimeout);
        };
    }, [positionList]);

    useEffect(() => {
        if (previousPositionIndexRef.current) {
            if (previousPositionIndexRef.current + 1 === positionIndex) {
                handleFastForwardMoveAnimation();
            } else if (previousPositionIndexRef.current - 1 === positionIndex) {
                handleReplayMoveAnimation();
            } else {
                setParsedFEN(positionList[positionIndex]?.["position"]);
                setLastDraggedSquare(
                    positionList[positionIndex]?.["last_dragged_square"]
                );
                setLastDroppedSquare(
                    positionList[positionIndex]?.["last_dropped_square"]
                );
            }
        } else {
            setParsedFEN(positionList[positionIndex]?.["position"]);
            setLastDraggedSquare(
                positionList[positionIndex]?.["last_dragged_square"]
            );
            setLastDroppedSquare(
                positionList[positionIndex]?.["last_dropped_square"]
            );
        }

        const moveType = positionList[positionIndex]?.["move_type"];
        if (!isNullOrUndefined(moveType)) {
            playAudio(moveType);
        }
    }, [positionIndex]);

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

    function handleFastForwardMoveAnimation() {
        const moveInfo = positionList[positionIndex]["move_info"];

        const startingSquare = moveInfo["starting_square"];
        const destinationSquare = moveInfo["destination_square"];

        console.log(startingSquare, destinationSquare);

        // @ts-ignore
        animatePiece(
            startingSquare,
            destinationSquare,
            boardOrientation.toLowerCase()
        );

        setTimeout(() => {
            setParsedFEN(positionList[positionIndex]?.["position"]);
            setLastDraggedSquare(
                positionList[positionIndex]?.["last_dragged_square"]
            );
            setLastDroppedSquare(
                positionList[positionIndex]?.["last_dropped_square"]
            );
        }, convertToMilliseconds(pieceAnimationTime));
    }

    function handleReplayMoveAnimation() {
        const moveInfo = positionList[positionIndex + 1]["move_info"];

        const startingSquare = moveInfo["starting_square"];
        const destinationSquare = moveInfo["destination_square"];

        // @ts-ignore
        animateMoveReplay(
            startingSquare,
            destinationSquare,
            boardOrientation.toLowerCase()
        );

        setTimeout(() => {
            setParsedFEN(positionList[positionIndex]?.["position"]);
            setLastDraggedSquare(
                positionList[positionIndex]?.["last_dragged_square"]
            );
            setLastDroppedSquare(
                positionList[positionIndex]?.["last_dropped_square"]
            );
        }, convertToMilliseconds(pieceAnimationTime));
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
                        lastDraggedSquare={lastDraggedSquare}
                        lastDroppedSquare={lastDroppedSquare}
                        squareSize={58}
                        setPositionList={setPositionList}
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
