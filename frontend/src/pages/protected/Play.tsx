import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import MultiplayerChessboard from "../../components/global/chessboards/MultiplayerChessboard.tsx";
import Timer from "../../components/page/matchmaking/Timer.tsx";

import "../../styles/pages/play.scss";
import "../../styles/components/chessboard/board-actions.scss";

import {
	fetchMoveList,
	fetchPositionList,
	fetchTimer,
} from "../../utils/apiUtils.ts";

import GameOverModal from "../../components/global/modals/gameOverModals/MultiplayerModal.tsx";
import GameplaySettings from "../../components/global/modals/GameplaySettings.tsx";
import ModalWrapper from "../../components/global/wrappers/ModalWrapper.js";
import { OptionalValue } from "../../types/general.js";
import {
	MoveInfo,
	ParsedFENString,
	PieceColor,
} from "../../types/gameLogic.js";
import useGameplaySettings from "../../hooks/useGameplaySettings.ts";
import MoveListPanel from "../../components/global/gameplaySidePanel/MoveListPanel.tsx";
import MoveNavigationButtons from "../../components/global/gameplaySidePanel/MoveNavigationButtons.tsx";
import GameplayActionButtons from "../../components/global/gameplaySidePanel/GameplayActionButtons.tsx";
import { isNullOrUndefined } from "../../utils/generalUtils.ts";
import MessageBox from "../../components/global/popups/MessageBox.tsx";
import { MessageBoxTypes } from "../../types/messageBox.ts";
import DrawOfferPopup from "../../components/global/popups/DrawOfferPopup.tsx";
import { playAudio } from "../../utils/audioUtils.ts";
import DashboardNavbar from "../../components/page/dashboard/DashboardNavbar.tsx";
import { convertToMilliseconds } from "../../utils/timeUtils.ts";
import { pieceAnimationTime } from "../../constants/pieceAnimation.ts";
import usePieceAnimation from "../../hooks/usePieceAnimation.ts";

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
			move_info: MoveInfo;
		}>
	>([]);

	const previousPositionIndexRef = useRef(null);
	const [positionIndex, setPositionIndex] = useState<number>(0);

	const [moveList, setMoveList] = useState<Array<Array<string>>>([]);

	const [hasGameEnded, setHasGameEnded] = useState<boolean>(false);
	const [gameEndedCause, setGameEndedCause] = useState<string>("");
	const [gameWinner, setGameWinner] = useState<string>("");

	const [messageBoxVisible, setMessageBoxVisible] = useState<boolean>(false);
	const [messageToDisplay, setMessageToDisplay] = useState<string>("");
	const [messageType, setMessageType] = useState<MessageBoxTypes>("info");

	const [drawOfferReceived, setDrawOfferReceived] = useState<boolean>(false);

	const [parsedFEN, setParsedFEN] = useState(
		positionList[positionIndex]?.["position"]
	);
	const [lastDraggedSquare, setLastDraggedSquare] = useState(
		positionList[positionIndex]?.["last_dragged_square"]
	);
	const [lastDroppedSquare, setLastDroppedSquare] = useState(
		positionList[positionIndex]?.["last_dropped_square"]
	);
	const moveType = positionList[positionIndex]?.["move_type"];

	const [boardOrientation, setBoardOrientation] = useState(
		location.state?.assignedColor || "White"
	);

	const [
		pieceAnimationSquare,
		pieceAnimationStyles,
		animatePiece,
		animateMoveReplay,
	] = usePieceAnimation();

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
		setTimeout(() => {
			setPositionIndex(positionList.length - 1);
		}, convertToMilliseconds(pieceAnimationTime));
	}, [positionList]);

	useEffect(() => {
		if (!isNullOrUndefined(previousPositionIndexRef.current)) {
			if (previousPositionIndexRef.current! + 1 === positionIndex) {
				handleFastForwardMoveAnimation();
			} else if (
				previousPositionIndexRef.current! - 1 ===
				positionIndex
			) {
				setParsedFEN(positionList[positionIndex]?.["position"]);
				setLastDraggedSquare(
					positionList[positionIndex]?.last_dragged_square
				);
				setLastDroppedSquare(
					positionList[positionIndex]?.last_dropped_square
				);
			} else {
				setParsedFEN(positionList[positionIndex]?.["position"]);
				setLastDraggedSquare(
					positionList[positionIndex]?.last_dragged_square
				);
				setLastDroppedSquare(
					positionList[positionIndex]?.last_dropped_square
				);
			}
		} else {
			setParsedFEN(positionList[positionIndex]?.["position"]);
			setLastDraggedSquare(
				positionList[positionIndex]?.last_dragged_square
			);
			setLastDroppedSquare(
				positionList[positionIndex]?.last_dropped_square
			);
		}

		if (!isNullOrUndefined(moveType)) {
			playAudio(moveType);
		}
	}, [positionIndex]);

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

	function handleFastForwardMoveAnimation() {
		const moveInfo = positionList[positionIndex]["move_info"];
		
		const startingSquare = moveInfo["starting_square"];
		const destinationSquare = moveInfo["destination_square"];

		// @ts-ignore
		animatePiece(
			startingSquare,
			destinationSquare,
			boardOrientation.toLowerCase()
		);

		setTimeout(() => {
			setParsedFEN(positionList[positionIndex]?.["position"]);
			setLastDraggedSquare(positionList[positionIndex]?.last_dragged_square);
			setLastDroppedSquare(positionList[positionIndex]?.last_dropped_square);
		}, convertToMilliseconds(pieceAnimationTime));
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
			<DashboardNavbar />
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
							// @ts-ignore
							parentAnimationSquare={pieceAnimationSquare}
							// @ts-ignore
							parentAnimationStyles={pieceAnimationStyles}
						/>
					</div>

					<GameOverModal
						visible={hasGameEnded}
						gameEndCause={gameEndedCause}
						gameWinner={gameWinner}
						timeControlInfo={{
							baseTime: location.state?.baseTime,
							increment: location.state?.increment,
						}}
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
						setPositionIndex={setPositionIndex}
						previousPositionIndexRef={previousPositionIndexRef}
						positionListLength={positionList.length}
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
			</div>

			<DrawOfferPopup
				onClose={() => {
					setDrawOfferReceived(false);
				}}
				visible={drawOfferReceived}
				actionWebsocketRef={actionWebSocketRef}
			/>

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
		</>
	);
}

export default Play;
