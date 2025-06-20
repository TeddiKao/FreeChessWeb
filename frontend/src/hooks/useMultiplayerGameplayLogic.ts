import { useEffect, useRef, useState } from "react";
import {
	CheckmateEventData,
	MoveListUpdateEventData,
	MoveMadeEventData,
	PositionList,
	PositionListUpdateEventData,
	TimerChangedEventData,
} from "../interfaces/gameLogic";
import {
	fetchLegalMoves,
	fetchMoveIsValid,
	fetchMoveList,
	fetchPositionList,
	fetchSideToMove,
	fetchTimer,
} from "../utils/apiUtils";
import { websocketBaseURL } from "../constants/urls";
import { getAccessToken } from "../utils/tokenUtils";
import useWebsocketWithLifecycle from "./useWebsocketWithLifecycle";
import { ChessboardSquareIndex } from "../types/general";
import {
	BoardPlacement,
	MoveInfo,
	ParsedFENString,
	PieceColor,
	PieceType,
} from "../types/gameLogic";
import { GameplayWebSocketEventTypes } from "../enums/gameLogic";
import { getOppositeColor } from "../utils/gameLogic/general";
import { isPawnPromotion } from "../utils/moveUtils";
import {
	animatePieceImage,
	clearSquaresStyling,
	getRank,
	getSquareExists,
} from "../utils/boardUtils";
import useGameplaySettings from "./useGameplaySettings";
import useAnimationLogic from "./gameLogic/useAnimationLogic";
import usePlayerClocks from "./gameLogic/usePlayerClocks";
import useClickedSquaresState from "./gameLogic/useClickedSquaresState";
import useDraggedSquaresState from "./gameLogic/useDraggedSquaresState";
import useGameEndState from "./gameLogic/useGameEndState";

function useMultiplayerGameplayLogic(
	gameId: number,
	baseTime: number,
	orientation: PieceColor
) {
	const gameWebsocketUrl = `${websocketBaseURL}/ws/game-server/?token=${getAccessToken()}&gameId=${gameId}`;
	const { socketRef: gameWebsocketRef } = useWebsocketWithLifecycle({
		url: gameWebsocketUrl,
		onMessage: handleOnMessage,
		enabled: true,
	});

	const {
		prevClickedSquare,
		clickedSquare,
		setPrevClickedSquare,
		setClickedSquare,
	} = useClickedSquaresState(handleClickToMove);

	const { draggedSquare, setDraggedSquare, droppedSquare, setDroppedSquare } =
		useDraggedSquaresState(handleOnDrop);

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
	} = useGameEndState();

	const [sideToMove, setSideToMove] = useState<PieceColor>("white");

	const boardStateBeforePromotion = useRef<BoardPlacement | null>(null);
	const prePromotionBoardState = useRef<ParsedFENString | null>(null);

	const promotionSquareRef = useRef<ChessboardSquareIndex | null>(null);
	const originalPawnSquareRef = useRef<ChessboardSquareIndex | null>(null);

	const [shouldShowPromotionPopup, setShouldShowPromotionPopup] =
		useState(false);

	const lastUsedMoveMethodRef = useRef<"click" | "drag" | null>(null);

	const { prepareAnimationData, animationRef, animationSquare } =
		useAnimationLogic(orientation);

	const gameplaySettings = useGameplaySettings();

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

	useEffect(() => {
		updatePositionList();
		updateMoveList();
		updateSideToMove();
		synchronisePositionIndex();
	}, []);

	async function handleClickToMove() {
		clearSquaresStyling();

		if (!prevClickedSquare) return;
		if (!getSquareExists(prevClickedSquare, parsedFEN["board_placement"]))
			return;

		if (!clickedSquare) {
			displayLegalMoves(prevClickedSquare!);

			return;
		}

		if (prevClickedSquare === clickedSquare) {
			setPrevClickedSquare(null);
			setClickedSquare(null);

			return;
		}

		const isValidMove = await performMoveValidation(
			prevClickedSquare!,
			clickedSquare!
		);

		console.log(isValidMove);

		if (!isValidMove) return;

		const boardPlacement = parsedFEN["board_placement"];
		const pieceInfo = boardPlacement[prevClickedSquare.toString()];
		const pieceColor = pieceInfo["piece_color"];
		const pieceType = pieceInfo["piece_type"];

		if (pieceType.toLowerCase() === "pawn") {
			storeBoardStateBeforePromotion(pieceColor, clickedSquare);

			if (isPawnPromotion(pieceColor, getRank(clickedSquare))) {
				preparePromotion(prevClickedSquare, clickedSquare);
				handlePawnPromotion();
				performPostMoveCleanup("click");

				return;
			}
		}

		sendRegularMove(prevClickedSquare, clickedSquare);
		performPostMoveCleanup("click");
	}

	async function handleOnDrop() {
		clearSquaresStyling();

		if (!draggedSquare) return;

		if (!droppedSquare) {
			displayLegalMoves(draggedSquare!);

			return;
		}

		if (draggedSquare === droppedSquare) {
			setDraggedSquare(null);
			setDroppedSquare(null);

			return;
		}

		const isValidMove = await performMoveValidation(
			draggedSquare!,
			droppedSquare!
		);

		if (!isValidMove) return;

		const boardPlacement = parsedFEN["board_placement"];
		const pieceInfo = boardPlacement[draggedSquare.toString()];
		const pieceColor = pieceInfo["piece_color"];
		const pieceType = pieceInfo["piece_type"];

		if (pieceType.toLowerCase() === "pawn") {
			storeBoardStateBeforePromotion(pieceColor, droppedSquare);

			if (isPawnPromotion(pieceColor, getRank(droppedSquare))) {
				preparePromotion(draggedSquare, droppedSquare);
				handlePawnPromotion();
				performPostMoveCleanup("drag");

				return;
			}
		}

		sendRegularMove(draggedSquare, droppedSquare);
		performPostMoveCleanup("drag");
	}

	async function synchronisePositionIndex() {
		const positionList = await fetchPositionList(gameId);
		setPositionIndex(positionList.length - 1);
	}

	function storeBoardStateBeforePromotion(
		color: PieceColor,
		destinationSquare: ChessboardSquareIndex
	) {
		if (!parsedFEN) return;

		const isPromotion = isPawnPromotion(color, getRank(destinationSquare));

		if (!isPromotion) return;

		boardStateBeforePromotion.current = parsedFEN["board_placement"];
	}

	function handlePawnPromotion() {
		if (!parsedFEN) return;

		if (!originalPawnSquareRef.current) return;
		if (!promotionSquareRef.current) return;

		const originalPawnSquare = originalPawnSquareRef.current;
		const promotionSquare = promotionSquareRef.current;

		// @ts-ignore
		const autoQueen = gameplaySettings["auto_queen"];

		if (autoQueen) {
			sendPromotionMove(originalPawnSquare, promotionSquare, "queen");
		} else {
			setShouldShowPromotionPopup(true);
		}
	}

	function preparePromotion(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex
	) {
		updatePrePromotionBoardState(startingSquare, destinationSquare);
		updatePromotionSquare(destinationSquare);
		updateOriginalPawnSquare(startingSquare);
	}

	function clearBoardStateBeforePromotion() {
		boardStateBeforePromotion.current = null;
	}

	function clearPrePromotionBoardState() {
		prePromotionBoardState.current = null;
	}

	function cancelPromotion() {
		setShouldShowPromotionPopup(false);

		clearPrePromotionBoardState();
		clearBoardStateBeforePromotion();
		clearPromotionSquare();
		clearOriginalPawnSquare();
	}

	function sendPromotionMove(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex,
		promotedPiece: PieceType
	) {
		if (!parsedFEN) return;

		const boardPlacement = parsedFEN["board_placement"];

		if (!boardPlacement) return;

		console.log(startingSquare.toString());
		console.log(boardPlacement);

		const pieceInfo = boardPlacement[startingSquare.toString()];
		const pieceColor = pieceInfo["piece_color"];
		const pieceType = pieceInfo["piece_type"];

		const moveDetails = {
			type: "move_made",

			piece_color: pieceColor,
			piece_type: pieceType,
			starting_square: startingSquare.toString(),
			destination_square: destinationSquare.toString(),

			additional_info: {
				promoted_piece: promotedPiece,
			},
		};

		gameWebsocketRef?.current?.send(JSON.stringify(moveDetails));

		clearBoardStateBeforePromotion();
		clearPrePromotionBoardState();
		clearPromotionSquare();
		clearOriginalPawnSquare();

		setShouldShowPromotionPopup(false);
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

	function sendRegularMove(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex
	) {
		if (!parsedFEN) return;

		const boardPlacement = parsedFEN["board_placement"];

		const pieceInfo = boardPlacement[startingSquare.toString()];
		const pieceColor = pieceInfo["piece_color"];
		const pieceType = pieceInfo["piece_type"];

		const moveDetails = {
			type: "move_made",

			piece_color: pieceColor,
			piece_type: pieceType,
			starting_square: startingSquare.toString(),
			destination_square: destinationSquare.toString(),

			additional_info: {},
		};

		gameWebsocketRef.current?.send(JSON.stringify(moveDetails));
	}

	function updatePromotionSquare(square: ChessboardSquareIndex) {
		promotionSquareRef.current = square;
	}

	function updateOriginalPawnSquare(square: ChessboardSquareIndex) {
		originalPawnSquareRef.current = square;
	}

	function clearOriginalPawnSquare() {
		originalPawnSquareRef.current = null;
	}

	function clearPromotionSquare() {
		promotionSquareRef.current = null;
	}

	function updatePrePromotionBoardState(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex
	) {
		if (!parsedFEN) return;

		const prePromotionParsedFEN = structuredClone(parsedFEN);
		const currentBoardPlacement = prePromotionParsedFEN["board_placement"];
		const pawnInfo = currentBoardPlacement[startingSquare.toString()];

		const prePromotionBoardPlacement = structuredClone(
			currentBoardPlacement
		);

		delete prePromotionBoardPlacement[startingSquare.toString()];
		prePromotionBoardPlacement[destinationSquare.toString()] = pawnInfo;

		prePromotionParsedFEN["board_placement"] = prePromotionBoardPlacement;
		prePromotionBoardState.current = prePromotionParsedFEN;
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

	function handleStalemate() {
		setHasGameEnded(true);
		setGameEndedCause("Stalemate");
	}

	function handleThreefoldRepetition() {
		setHasGameEnded(true);
		setGameEndedCause("Repetition");
	}

	function handle50MoveRule() {
		setHasGameEnded(true);
		setGameEndedCause("50-move-rule");
	}

	function handleInsufficientMaterial() {
		setHasGameEnded(true);
		setGameEndedCause("Insufficient material");
	}

	function handleCheckmate(eventData: CheckmateEventData) {
		setHasGameEnded(true);
		setGameEndedCause("Checkmate");
		setGameWinner(eventData["winning_color"] as PieceColor);
	}

	function handlePlayerTimeout(eventData: any) {
		setHasGameEnded(true);
		setGameEndedCause("Timeout");
		setGameWinner(getOppositeColor(eventData["timeout_color"]));
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

	function handleOnMessage(event: MessageEvent) {
		const eventData = JSON.parse(event.data);
		const eventType = eventData["type"];

		switch (eventType) {
			case GameplayWebSocketEventTypes.MOVE_MADE:
				handleMoveMade(eventData);
				break;

			case GameplayWebSocketEventTypes.TIMER_DECREMENTED:
			case GameplayWebSocketEventTypes.TIMER_INCREMENTED:
				handleTimerChanged(eventData);
				break;

			case GameplayWebSocketEventTypes.POSITION_LIST_UPDATED:
				handlePositionListUpdated(eventData);
				break;

			case GameplayWebSocketEventTypes.MOVE_LIST_UPDATED:
				handleMoveListUpdated(eventData);
				break;

			case GameplayWebSocketEventTypes.PLAYER_CHECKMATED:
				handleCheckmate(eventData);
				break;

			case GameplayWebSocketEventTypes.PLAYER_STALEMATED:
				handleDraw("Stalemate");
				break;

			case GameplayWebSocketEventTypes.THREEFOLD_REPETITION_DETECTED:
				handleDraw("Repetition")
				break;

			case GameplayWebSocketEventTypes.FIFTY_MOVE_RULE_DETECTED:
				handleDraw("50-move-rule")
				break;

			case GameplayWebSocketEventTypes.INSUFFICIENT_MATERIAL:
				handleDraw("Insufficient material")
				break;

			case GameplayWebSocketEventTypes.PLAYER_TIMEOUT:
				handlePlayerTimeout(eventData);
				break;

			default:
				break;
		}
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
