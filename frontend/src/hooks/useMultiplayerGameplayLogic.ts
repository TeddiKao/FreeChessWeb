import { useCallback, useMemo, useRef } from "react";
import { MoveMadeEventData } from "../interfaces/gameLogic";
import { fetchLegalMoves, fetchMoveIsValid } from "../utils/apiUtils";
import { ChessboardSquareIndex } from "../types/general";
import { PieceColor, PieceType } from "../types/gameLogic";
import { isPawnPromotion } from "../utils/moveUtils";
import { clearSquaresStyling, getRank } from "../utils/boardUtils";

import useAnimationLogic from "./gameLogic/useAnimationLogic";
import usePlayerClocks from "./gameLogic/usePlayerClocks";
import useClickedSquaresState from "./gameLogic/useClickedSquaresState";
import useDraggedSquaresState from "./gameLogic/useDraggedSquaresState";
import useGameEndState from "./gameLogic/useGameEndState";
import useMultiplayerGameplayWebsocket from "./useMultiplayerGameplayWebsocket";
import useClickMoveEffect from "./gameLogic/useClickMoveEffect";
import useDragMoveEffect from "./gameLogic/useDragMoveEffect";
import usePromotionLogic from "./gameLogic/usePromotionLogic";
import usePositionList from "./gameLogic/usePositionList";
import useMoveList from "./gameLogic/useMoveList";
import useSideToMove from "./gameLogic/useSideToMove";
import {
	displayLegalMoves,
	performMoveValidation,
} from "../features/gameplay/common/utils/moveService";

function useMultiplayerGameplayLogic(
	gameId: number,
	baseTime: number,
	orientation: PieceColor
) {
	const {
		prevClickedSquare,
		clickedSquare,
		setPrevClickedSquare,
		setClickedSquare,
	} = useClickedSquaresState();
	const { draggedSquare, setDraggedSquare, droppedSquare, setDroppedSquare } =
		useDraggedSquaresState();

	const { whitePlayerClock, blackPlayerClock, handleTimerChanged } =
		usePlayerClocks(gameId, baseTime);

	const {
		hasGameEnded,
		gameEndedCause,
		gameWinner,
		setHasGameEnded,
		setGameEndedCause,
		setGameWinner,
		handleDraw,
		handleCheckmate,
		handlePlayerTimeout,
	} = useGameEndState();

	const { sideToMove, setSideToMove } = useSideToMove(gameId);

	const lastUsedMoveMethodRef = useRef<"click" | "drag" | null>(null);

	const { prepareAnimationData, animationRef, animationSquare } =
		useAnimationLogic(orientation);

	const {
		positionList,
		positionIndex,
		parsedFEN,
		setPositionIndex,
		handlePositionListUpdated,
		capturedMaterial,
		promotedPieces,
		previousDraggedSquare,
		previousDroppedSquare,
	} = usePositionList(gameId);

	const { moveList, handleMoveListUpdated } = useMoveList(gameId);

	const {
		preparePromotion,
		cancelPromotion,
		performPostPromotionCleanup,
		handlePawnPromotion,
		promotionSquareRef,
		originalPawnSquareRef,
		prePromotionBoardState,
		shouldShowPromotionPopup,
	} = usePromotionLogic(parsedFEN);

	const { sendPromotionMove, sendRegularMove } =
		useMultiplayerGameplayWebsocket({
			gameId,
			parsedFEN,
			handleMoveMade,
			handleMoveListUpdated,
			handlePositionListUpdated,
			handleCheckmate,
			handlePlayerTimeout,
			handleTimerChanged,
			handleDraw,
			performPostPromotionCleanup,
		});

	const processMove = useCallback(
		async (moveMethod: "click" | "drag") => {
			clearSquaresStyling();

			const usingDrag = moveMethod === "drag";
			const startingSquare = usingDrag
				? draggedSquare
				: prevClickedSquare;
			const destinationSquare = usingDrag ? droppedSquare : clickedSquare;

			if (!startingSquare) return;

			if (!destinationSquare) {
				displayLegalMoves(parsedFEN, startingSquare);

				return;
			}

			if (startingSquare === destinationSquare) {
				performPostMoveCleanup(moveMethod);

				return;
			}

			const isValidMove = await performMoveValidation(
				parsedFEN,
				startingSquare,
				destinationSquare
			);

			if (!isValidMove) return;

			const boardPlacement = parsedFEN["board_placement"];
			const pieceInfo = boardPlacement[startingSquare.toString()];
			const pieceColor = pieceInfo["piece_color"];
			const pieceType = pieceInfo["piece_type"];

			if (pieceType.toLowerCase() === "pawn") {
				if (isPawnPromotion(pieceColor, getRank(destinationSquare))) {
					preparePromotion(startingSquare, destinationSquare);
					handlePawnPromotion(sendPromotionMove);
					performPostMoveCleanup(moveMethod);

					return;
				}
			}

			sendRegularMove(startingSquare, destinationSquare);
			performPostMoveCleanup(moveMethod);
		},
		[prevClickedSquare, clickedSquare, draggedSquare, droppedSquare]
	);

	const dragMoveCallback = useCallback(() => {
		processMove("drag");
	}, [processMove]);

	const clickMoveCallback = useCallback(() => {
		processMove("click");
	}, [processMove]);

	const clickDeps = useMemo(
		() => [prevClickedSquare, clickedSquare],
		[prevClickedSquare, clickedSquare]
	);

	const dragDeps = useMemo(
		() => [draggedSquare, droppedSquare],
		[draggedSquare, droppedSquare]
	);

	useClickMoveEffect(clickDeps, clickMoveCallback);
	useDragMoveEffect(dragDeps, dragMoveCallback);

	function performPostMoveCleanup(moveMethod: "click" | "drag") {
		if (moveMethod === "click") {
			setPrevClickedSquare(null);
			setClickedSquare(null);

			lastUsedMoveMethodRef.current = "click";
		} else {
			setDraggedSquare(null);
			setDroppedSquare(null);

			lastUsedMoveMethodRef.current = "drag";
		}
	}

	function handleMoveMade(eventData: MoveMadeEventData) {
		const startingSquare = eventData["move_data"]["starting_square"];
		const destinationSquare = eventData["move_data"]["destination_square"];

		const postAnimationCallback = () => {
			setPositionIndex(eventData["new_position_index"]);
			setSideToMove(eventData["new_side_to_move"]);
		};

		prepareAnimationData(
			startingSquare,
			destinationSquare,
			postAnimationCallback
		);
	}

	return {
		prevClickedSquare,
		clickedSquare,
		setPrevClickedSquare,
		setClickedSquare,

		draggedSquare,
		droppedSquare,
		setDraggedSquare,
		setDroppedSquare,

		parsedFEN,
		previousDraggedSquare,
		previousDroppedSquare,
		sideToMove,

		gameStateHistory: {
			positionList,
			moveList,
			positionIndex,
			setPositionIndex,
		},

		capturedMaterial,
		promotedPieces,

		gameEnded: hasGameEnded,
		gameWinner,
		gameEndedCause,

		setHasGameEnded: setHasGameEnded,
		setGameEndedCause,
		setGameWinner,

		clocks: {
			whitePlayerClock,
			blackPlayerClock,
		},

		shouldShowPromotionPopup,
		prePromotionBoardState: prePromotionBoardState.current,
		promotionSquare: promotionSquareRef.current,
		originalPawnSquare: originalPawnSquareRef.current,
		cancelPromotion,
		handlePromotionPieceSelected: (
			color: PieceColor,
			promotedPiece: PieceType
		) => {
			if (!originalPawnSquareRef.current) return;
			if (!promotionSquareRef.current) return;

			sendPromotionMove(
				originalPawnSquareRef.current,
				promotionSquareRef.current,
				promotedPiece
			);
		},

		animationRef,
		animationSquare,
		prepareAnimationData,
	};
}

export default useMultiplayerGameplayLogic;
