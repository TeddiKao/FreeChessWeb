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
	fetchTimer,
} from "../utils/apiUtils";
import { websocketBaseURL } from "../constants/urls";
import { getAccessToken } from "../utils/tokenUtils";
import useWebsocketWithLifecycle from "./useWebsocketWithLifecycle";
import { ChessboardSquareIndex } from "../types/general";
import { BoardPlacement, PieceColor, PieceInfo } from "../types/gameLogic";
import { GameplayWebSocketEventTypes } from "../enums/gameLogic";
import { getOppositeColor } from "../utils/gameLogic/general";
import { isPawnCapture, isPawnPromotion } from "../utils/moveUtils";
import { getFile, getRank } from "../utils/boardUtils";
import useGameplaySettings from "./useGameplaySettings";

function useMultiplayerGameplayLogic(gameId: number) {
	const gameWebsocketUrl = `${websocketBaseURL}/ws/game-server/?token=${getAccessToken()}&gameId=${gameId}`;
	const { socketRef: gameWebsocketRef } = useWebsocketWithLifecycle({
		url: gameWebsocketUrl,
		onMessage: handleOnMessage,
		enabled: true,
	});

	const [prevClickedSquare, setPrevClickedSquare] =
		useState<ChessboardSquareIndex | null>(null);
	const [clickedSquare, setClickedSquare] =
		useState<ChessboardSquareIndex | null>(null);

	const [draggedSquare, setDraggedSquare] =
		useState<ChessboardSquareIndex | null>(null);
	const [droppedSquare, setDroppedSquare] =
		useState<ChessboardSquareIndex | null>(null);

	const [whitePlayerClock, setWhitePlayerClock] = useState<number | null>(
		null
	);
	const [blackPlayerClock, setBlackPlayerClock] = useState<number | null>(
		null
	);

	const [hasGameEnded, setHasGameEnded] = useState<boolean>(false);
	const [gameEndedCause, setGameEndedCause] = useState<string | null>(null);
	const [gameWinner, setGameWinner] = useState<PieceColor | null>(null);

	const boardStateBeforePromotion = useRef<BoardPlacement | null>(null);
	const prePromotionBoardState = useRef<BoardPlacement | null>(null);
	const [shouldShowPromotionPopup, setShouldShowPromotionPopup] =
		useState(false);

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
		updatePlayerClocks();
	}, []);

	useEffect(() => {
		handleOnDrop();
	}, [draggedSquare, droppedSquare]);

	useEffect(() => {
		handleClickToMove();
	}, [prevClickedSquare, clickedSquare]);

	async function handleClickToMove() {
		if (!prevClickedSquare) return;

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

		if (!isValidMove) return;

		const boardPlacement = parsedFEN["board_placement"];
		const pieceInfo = boardPlacement[prevClickedSquare.toString()];
		const pieceColor = pieceInfo["piece_color"];
		const pieceType = pieceInfo["piece_type"];

		if (pieceType.toLowerCase() === "pawn") {
			storeBoardStateBeforePromotion(pieceColor, clickedSquare);

			if (isPawnPromotion(pieceColor, getRank(clickedSquare))) {
			}
		}
	}

	async function handleOnDrop() {
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
		}
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

	function handlePawnPromotion(startingSquare: ChessboardSquareIndex, destinationSquare: ChessboardSquareIndex) {
		if (!parsedFEN) return;
		
		updatePrePromotionBoardState(startingSquare, destinationSquare);
	}

	function updatePrePromotionBoardState(
		startingSquare: ChessboardSquareIndex,
		destinationSquare: ChessboardSquareIndex
	) {
		if (!parsedFEN) return;

		const currentBoardPlacement = parsedFEN["board_placement"];
		const pawnInfo = currentBoardPlacement[startingSquare.toString()];
		
		const prePromotionBoardPlacement = structuredClone(
			currentBoardPlacement
		);

		delete prePromotionBoardPlacement[startingSquare.toString()]
		prePromotionBoardPlacement[destinationSquare.toString()] = pawnInfo;

		prePromotionBoardState.current = prePromotionBoardPlacement;
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
			startSquare,
			destinationSquare
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
			pieceColor,
			pieceType,
			startSquare
		);

		if (!legalMoves) return;

		for (const legalMove of legalMoves) {
			const square = document.getElementById(legalMove);
			if (!square) return;

			square.classList.add("legal-square");
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

	async function updatePlayerClocks() {
		const whitePlayerClock = await fetchTimer(gameId, "white");
		const blackPlayerClock = await fetchTimer(gameId, "black");

		setWhitePlayerClock(whitePlayerClock);
		setBlackPlayerClock(blackPlayerClock);
	}

	function handleTimerChanged(eventData: TimerChangedEventData) {
		setWhitePlayerClock(eventData["white_player_clock"]);
		setBlackPlayerClock(eventData["black_player_clock"]);
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
		setPositionIndex(eventData["new_position_index"]);
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
				handleStalemate();
				break;

			case GameplayWebSocketEventTypes.THREEFOLD_REPETITION_DETECTED:
				handleThreefoldRepetition();
				break;

			case GameplayWebSocketEventTypes.FIFTY_MOVE_RULE_DETECTED:
				handle50MoveRule();
				break;

			case GameplayWebSocketEventTypes.INSUFFICIENT_MATERIAL:
				handleInsufficientMaterial();
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

		gameStateHistory: {
			positionList,
			moveList,
			positionIndex,
		},

		capturedMaterial,
		promotedPieces,

		gameEnded: hasGameEnded,
		gameWinner,
		gameEndedCause,

		clocks: {
			whitePlayerClock,
			blackPlayerClock,
		},
	};
}

export default useMultiplayerGameplayLogic;
