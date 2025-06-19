import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import MultiplayerChessboard from "../../features/gameplay/chessboards/MultiplayerChessboard.tsx";
import Timer from "../../features/gameplay/Timer.tsx";

import "../../styles/pages/play.scss";
import "../../styles/components/chessboard/board-actions.scss";

import GameOverModal from "../../features/modals/gameOverModals/MultiplayerModal.tsx";
import GameplaySettings from "../../features/modals/GameplaySettings.tsx";
import ModalWrapper from "../../components/wrappers/ModalWrapper.js";
import { PieceColor } from "../../types/gameLogic.js";
import useGameplaySettings from "../../hooks/useGameplaySettings.ts";
import MoveListPanel from "../../features/gameplay/gameplaySidePanel/MoveListPanel.tsx";
import MoveNavigationButtons from "../../features/gameplay/gameplaySidePanel/MoveNavigationButtons.tsx";
import GameplayActionButtons from "../../features/gameplay/gameplaySidePanel/GameplayActionButtons.tsx";
import { isNullOrUndefined } from "../../utils/generalUtils.ts";
import MessageBox from "../../components/common/MessageBox.tsx";
import { MessageBoxTypes } from "../../types/messageBox.ts";
import DrawOfferPopup from "../../features/popups/DrawOfferPopup.tsx";
import DashboardNavbar from "../../components/common/DashboardNavbar/DashboardNavbar.tsx";
import CapturedMaterial from "../../features/gameplay/CapturedMaterial.tsx";
import { getOppositeColor } from "../../utils/gameLogic/general.ts";
import useMultiplayerGameplayLogic from "../../hooks/useMultiplayerGameplayLogic.ts";

function Play() {
	const location = useLocation();

	const {
		parsedFEN,
		gameStateHistory: { positionList, moveList, setPositionIndex },
		clocks: { whitePlayerClock, blackPlayerClock },
		capturedMaterial: capturedMaterialList,
		promotedPieces: promotedPiecesList,
		gameEnded: hasGameEnded,
		gameEndedCause,
		gameWinner,
		setGameEndedCause,
		setGameWinner,
		setHasGameEnded,
		sideToMove,

		previousDraggedSquare,
		previousDroppedSquare,
		prevClickedSquare,
		setPrevClickedSquare,
		clickedSquare,
		setClickedSquare,

		draggedSquare,
		setDraggedSquare,
		droppedSquare,
		setDroppedSquare,

		shouldShowPromotionPopup,
		promotionSquare,
		prePromotionBoardState,
		cancelPromotion,
		handlePromotionPieceSelected,

		animationRef,
		animationSquare,
	} = useMultiplayerGameplayLogic(
		location.state?.gameId,
		location.state?.baseTime
	);

	const previousPositionIndexRef = useRef(null);

	const [messageBoxVisible, setMessageBoxVisible] = useState<boolean>(false);
	const [messageToDisplay, setMessageToDisplay] = useState<string>("");
	const [messageType, setMessageType] = useState<MessageBoxTypes>("info");

	const [drawOfferReceived, setDrawOfferReceived] = useState<boolean>(false);

	const [boardOrientation, setBoardOrientation] = useState(
		location.state?.assignedColor || "White"
	);

	const [settingsVisible, setSettingsVisible] = useState(false);

	const initialGameplaySettings = useGameplaySettings();
	const [gameplaySettings, setGameplaySettings] = useState(
		initialGameplaySettings
	);

	const actionWebSocketRef = useRef(null);

	const whitePlayerUsername = location.state?.whitePlayerUsername;
	const blackPlayerUsername = location.state?.blackPlayerUsername;

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
			return whitePlayerClock;
		} else {
			return blackPlayerClock;
		}
	}

	const topTimerAmount = getTimeAmount(topTimerColor);
	const bottomTimerAmount = getTimeAmount(bottomTimerColor);

	if (
		isNullOrUndefined(topTimerAmount) ||
		isNullOrUndefined(bottomTimerAmount)
	) {
		console.log("No top or bottom timer amount!");
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
					<div className="top-player-info">
						<div className="top-player-captured-material">
							<CapturedMaterial
								color={getOppositeColor(topTimerColor)}
								capturedPiecesList={
									capturedMaterialList[
										getOppositeColor(topTimerColor)
									]
								}
								promotedPiecesList={
									promotedPiecesList[topTimerColor]
								}
							/>
						</div>

						<div className="top-timer-wrapper">
							<Timer
								playerColor={topTimerColor}
								timeInSeconds={topTimerAmount!}
								isActive={sideToMove === topTimerColor}
								startingTimeInSeconds={location.state?.baseTime}
							/>
						</div>
					</div>

					<div className="chessboard-info">
						<MultiplayerChessboard
							parsed_fen_string={
								prePromotionBoardState ?? parsedFEN
							}
							orientation={boardOrientation}
							previousDraggedSquare={previousDraggedSquare}
							previousDroppedSquare={previousDroppedSquare}
							shouldShowPromotionPopup={shouldShowPromotionPopup}
							cancelPromotion={cancelPromotion}
							onPromotion={handlePromotionPieceSelected}
							clickedSquaresState={{
								clickedSquare,
								setClickedSquare,
								prevClickedSquare,
								setPrevClickedSquare,
							}}
							dragAndDropSquaresState={{
								draggedSquare,
								setDraggedSquare,
								droppedSquare,
								setDroppedSquare,
							}}
							promotionSquare={promotionSquare}
							animationRef={animationRef}
							animationSquare={animationSquare}
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
						whitePlayerUsername={whitePlayerUsername}
						blackPlayerUsername={blackPlayerUsername}
					/>

					<ModalWrapper visible={settingsVisible}>
						<GameplaySettings
							onClose={handleSettingsClose}
							setGameplaySettings={setGameplaySettings}
						/>
					</ModalWrapper>

					<div className="bottom-player-info">
						<div className="bottom-player-captured-material">
							<CapturedMaterial
								color={getOppositeColor(bottomTimerColor)}
								capturedPiecesList={
									capturedMaterialList[
										getOppositeColor(bottomTimerColor)
									]
								}
								promotedPiecesList={
									promotedPiecesList[bottomTimerColor]
								}
							/>
						</div>

						<div className="bottom-timer-wrapper">
							<Timer
								playerColor={bottomTimerColor}
								timeInSeconds={bottomTimerAmount!}
								isActive={sideToMove === bottomTimerColor}
								startingTimeInSeconds={location.state?.baseTime}
							/>
						</div>
					</div>
				</div>

				<div className="board-actions">
					<img
						onClick={toggleBoardOrientation}
						className="flip-board-icon"
						src="/icons/gameplay/boardActions/flip-board-icon.png"
					/>
					<img
						className="settings-icon"
						src="/icons/gameplay/boardActions/settings.svg"
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
