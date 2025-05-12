import { useEffect, useState } from "react";
import BotChessboard from "../../components/global/chessboards/BotChessboard";
import DashboardNavbar from "../../components/page/dashboard/DashboardNavbar";
import {
	fetchBotGameMoveList,
	fetchBotGamePositionList,
} from "../../utils/apiUtils";
import { ParsedFENString } from "../../types/gameLogic";

import "../../styles/pages/play-bot.scss";
import useGameplaySettings from "../../hooks/useGameplaySettings";
import GameplaySettings from "../../components/global/modals/GameplaySettings";
import ModalWrapper from "../../components/global/wrappers/ModalWrapper";
import { Navigate, useLocation } from "react-router-dom";
import { ChessboardSquareIndex } from "../../types/general";
import MoveNavigationButtons from "../../components/global/gameplaySidePanel/MoveNavigationButtons";
import MoveListPanel from "../../components/global/gameplaySidePanel/MoveListPanel";
import { isNullOrUndefined } from "../../utils/generalUtils";
import { playAudio } from "../../utils/audioUtils";
import LocalGameOverModal from "../../components/global/modals/gameOverModals/LocalModal";
import { convertToMilliseconds } from "../../utils/timeUtils";
import { pieceAnimationTime } from "../../constants/pieceAnimation";

function PlayBot() {
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
			position: ParsedFENString;
			move_type: string;
			last_dragged_square: ChessboardSquareIndex;
			last_dropped_square: ChessboardSquareIndex;
		}>
	>([]);
	const [positionIndex, setPositionIndex] = useState<number>(
		positionList.length - 1
	);
	const parsedFEN = positionList[positionIndex]?.["position"];
	const lastDraggedSquare =
		positionList[positionIndex]?.["last_dragged_square"];
	const lastDroppedSquare =
		positionList[positionIndex]?.["last_dropped_square"];

	const [moveList, setMoveList] = useState<Array<Array<string>>>([]);

	const location = useLocation();
	const gameId = location.state?.gameId;
	const bot = location.state?.bot;
	const assignedColor = location.state?.assignedColor

	const [boardOrientation, setBoardOrientation] = useState<string>(assignedColor);

	useEffect(() => {
		updateMoveList();
		updatePositionList();
	}, [gameId]);

	useEffect(() => {
		setTimeout(() => {
			setPositionIndex(positionList.length - 1);
		}, convertToMilliseconds(pieceAnimationTime))
	}, [positionList]);

	useEffect(() => {
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
						parsed_fen_string={parsedFEN}
						orientation={boardOrientation}
						gameplaySettings={gameplaySettings}
						gameId={gameId}
						setMoveList={setMoveList}
						setPositionList={setPositionList}
						botId={bot}
						setGameEnded={setHasGameEnded}
						setGameWinner={setGameWinner}
						setGameEndedCause={setGameEndedCause}
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

				<div className="gameplay-side-panel">
					<MoveListPanel
						moveList={moveList}
						setPositionIndex={setPositionIndex}
						gameWinner={gameWinner}
						gameEnded={hasGameEnded}
					/>

					<MoveNavigationButtons
						setPositionIndex={setPositionIndex}
						positionListLength={positionList.length}
					/>
				</div>
			</div>

			<ModalWrapper visible={gameplaySettingsVisible}>
				<GameplaySettings
					onClose={handleSettingsModalClose}
					setGameplaySettings={setGameplaySettings}
				/>
			</ModalWrapper>

			<LocalGameOverModal
				gameEndCause={gameEndedCause}
				gameWinner={gameWinner}
				visible={hasGameEnded}
			/>
		</>
	);
}

export default PlayBot;
