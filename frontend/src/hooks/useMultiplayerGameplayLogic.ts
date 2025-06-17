import { useEffect, useState } from "react";
import { CheckmateEventData, MoveListUpdateEventData, PositionList, PositionListUpdateEventData, TimerChangedEventData } from "../interfaces/gameLogic";
import {
	fetchMoveList,
	fetchPositionList,
	fetchTimer,
} from "../utils/apiUtils";
import { websocketBaseURL } from "../constants/urls";
import { getAccessToken } from "../utils/tokenUtils";
import useWebsocketWithLifecycle from "./useWebsocketWithLifecycle";
import { ChessboardSquareIndex } from "../types/general";
import { PieceColor } from "../types/gameLogic";
import { GameplayWebSocketEventTypes } from "../enums/gameLogic";
import { getOppositeColor } from "../utils/gameLogic/general";

function useMultiplayerGameplayLogic(gameId: number) {
	const gameWebsocketUrl = `${websocketBaseURL}/ws/game-server/?token=${getAccessToken()}&gameId=${gameId}`;
	const { socketRef: gameWebsocketRef } = useWebsocketWithLifecycle({
		url: gameWebsocketUrl,
		onMessage: () => {},
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

	const [positionList, setPositionList] = useState<PositionList>([]);
	const [positionIndex, setPositionIndex] = useState(0);

	const [moveList, setMoveList] = useState<Array<Array<string>>>([]);

	const parsedFEN = positionList[positionIndex]?.["position"];
	const previousDraggedSquare =
		positionList[positionIndex]?.["last_dragged_square"];
	const previousDroppedSquare =
		positionList[positionIndex]?.["last_dropped_square"];

	const moveType = positionList[positionIndex]?.["move_type"];

	const capturedMaterial = positionList[positionIndex]?.["captured_material"];
	const promotedPieces = positionList[positionIndex]?.["promoted_pieces"];

	useEffect(() => {
		updatePositionList();
		updateMoveList();
		updatePlayerClocks();
	}, []);

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

	function handleCheckmate(parsedEventData: CheckmateEventData) {
		setHasGameEnded(true);
		setGameEndedCause("Checkmate");
		setGameWinner(parsedEventData["winning_color"] as PieceColor);
	}

	function handlePlayerTimeout(parsedEventData: any) {
		setHasGameEnded(true);
		setGameEndedCause("Timeout");
		setGameWinner(getOppositeColor(parsedEventData["timeout_color"]));
	}

	function handleOnMessage(event: MessageEvent) {
		const eventData = JSON.parse(event.data);
		const eventType = eventData["type"];

		switch (eventType) {
			case GameplayWebSocketEventTypes.MOVE_MADE:
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
	};
}

export default useMultiplayerGameplayLogic;
