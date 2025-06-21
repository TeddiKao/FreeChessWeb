import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	MoveListUpdateEventData,
	MoveMadeEventData,
	PositionList,
	PositionListUpdateEventData,
} from "../interfaces/gameLogic";
import {
	fetchLegalMoves,
	fetchMoveIsValid,
	fetchMoveList,
	fetchPositionList,
	fetchSideToMove,
} from "../utils/apiUtils";
import { ChessboardSquareIndex } from "../types/general";
import {
	PieceColor,
	PieceType,
} from "../types/gameLogic";
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

	const [sideToMove, setSideToMove] = useState<PieceColor>("white");

	const lastUsedMoveMethodRef = useRef<"click" | "drag" | null>(null);

	const { prepareAnimationData, animationRef, animationSquare } =
		useAnimationLogic(orientation);

	const [positionList, setPositionList] = useState<PositionList>([]);
	const [positionIndex, setPositionIndex] = useState(0);

	const [moveList, setMoveList] = useState<Array<Array<string>>>([]);

	const parsedFEN = positionList[positionIndex]?.["position"];
	const previousDraggedSquare =
		positionList[positionIndex]?.["last_dragged_square"];
	const previousDroppedSquare =
		positionList[positionIndex]?.["last_dropped_square"];

	const capturedMaterial = positionList[positionIndex]?.["captured_material"];
	const promotedPieces = positionList[positionIndex]?.["promoted_pieces"];

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

	useEffect(() => {
		updatePositionList();
		updateMoveList();
		updateSideToMove();
		synchronisePositionIndex();
	}, []);

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
				displayLegalMoves(startingSquare);

				return;
			}

			if (startingSquare === destinationSquare) {
				performPostMoveCleanup(moveMethod);

				return;
			}

			const isValidMove = await performMoveValidation(
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

	async function synchronisePositionIndex() {
		const positionList = await fetchPositionList(gameId);
		setPositionIndex(positionList.length - 1);
	}

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

	async function performMoveValidation(
		startSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex
	) {
		if (!parsedFEN) return;

		const boardPlacement = parsedFEN["board_placement"];
		const squareInfo = boardPlacement[startSquare.toString()];
		const pieceColor = squareInfo["piece_color"];
		const pieceType = squareInfo["piece_type"];

		const [isValidMove, _] = await fetchMoveIsValid(
			parsedFEN,
			pieceColor,
			pieceType,
			startSquare.toString(),
			destinationSquare.toString()
		);

		return isValidMove;
	}

	async function displayLegalMoves(startSquare: ChessboardSquareIndex) {
		if (!parsedFEN) return;

		const squareInfo = parsedFEN["board_placement"][startSquare.toString()];
		const pieceType = squareInfo["piece_type"];
		const pieceColor = squareInfo["piece_color"];

		const legalMoves = await fetchLegalMoves(
			parsedFEN,
			pieceType,
			pieceColor,
			startSquare.toString()
		);

		console.log(legalMoves);

		if (!legalMoves) return;

		for (const legalMove of legalMoves) {
			const square = document.getElementById(legalMove);
			if (!square) return;

			square.classList.add("legal-square");
			console.log("Added!");
		}
	}

	async function updatePositionList() {
		const positionList = await fetchPositionList(gameId);

		setPositionList(positionList);
	}

	async function updateMoveList() {
		const moveList = await fetchMoveList(gameId);

		setMoveList(moveList);
	}

	async function updateSideToMove() {
		const sideToMove = await fetchSideToMove(gameId);

		setSideToMove(sideToMove);
	}

	function handlePositionListUpdated(eventData: PositionListUpdateEventData) {
		setPositionList(eventData["new_position_list"]);
	}

	function handleMoveListUpdated(eventData: MoveListUpdateEventData) {
		setMoveList(eventData["new_move_list"]);
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
