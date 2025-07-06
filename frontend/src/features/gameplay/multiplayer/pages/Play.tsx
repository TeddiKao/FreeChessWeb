import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import "../styles/play.scss";

import GameOverModal from "../modals/GameOverModal";
import GameplaySettings from "../../../settings/gameplay/GameplaySettings";
import BaseModal from "../../../../shared/components/layout/BaseModal.js";
import useGameplaySettings from "../../../settings/gameplay/hooks/useGameplaySettings";
import MessageBox from "../../../../shared/components/MessageBox";
import DrawOfferPopup from "../popups/DrawOfferPopup";
import DashboardNavbar from "../../../../shared/components/DashboardNavbar/DashboardNavbar";
import { getOppositeColor } from "../../passAndPlay/utils/general";
import useMultiplayerGameplayLogic from "../hooks/useMultiplayerGameplayLogic";
import { isNullOrUndefined } from "../../../../shared/utils/generalUtils.js";
import CapturedMaterial from "../../../../shared/components/chessElements/CapturedMaterial.js";
import GameplayActionButtons from "../../../../shared/components/chessElements/gameplaySidePanel/GameplayActionButtons.js";
import MoveListPanel from "../../../../shared/components/chessElements/gameplaySidePanel/MoveListPanel.js";
import MoveNavigationButtons from "../../../../shared/components/chessElements/gameplaySidePanel/MoveNavigationButtons.js";
import Timer from "../../../../shared/components/chessElements/Timer.js";
import { PieceColor } from "../../../../shared/types/chessTypes/pieces.types";
import MultiplayerChessboard from "../components/MultiplayerChessboard";
import BoardActions from "../../../../shared/components/chessboard/BoardActions.js";
import { MessageBoxTypes } from "../../../../shared/types/messageBox.types.js";

function Play() {
	const location = useLocation();

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

	const {
		parsedFEN,
		gameStateHistory: {
			positionList,
			moveList,
			setPositionIndex,
			positionIndex,
		},
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
		prepareAnimationData,
	} = useMultiplayerGameplayLogic(
		location.state?.gameId,
		location.state?.baseTime,
		boardOrientation
	);

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

					<BaseModal visible={settingsVisible}>
						<GameplaySettings
							onClose={handleSettingsClose}
							setGameplaySettings={setGameplaySettings}
						/>
					</BaseModal>

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

				<BoardActions
					displaySettings={handleSettingsDisplay}
					toggleBoardOrientation={toggleBoardOrientation}
				/>

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
						positionList={positionList}
						positionIndex={positionIndex}
						prepareAnimationData={prepareAnimationData}
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
