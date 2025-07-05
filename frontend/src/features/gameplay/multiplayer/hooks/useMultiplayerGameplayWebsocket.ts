import { websocketBaseURL } from "../../../../constants/urls";
import { ChessboardSquareIndex } from "../../../../shared/types/utility.types";
import { getAccessToken } from "../../../auth/utils";
import useWebsocketWithLifecycle from "../../../../shared/hooks/websocket/useWebsocketWithLifecycle";
import { ParsedFEN } from "../../common/types/gameState.types";
import { PieceType } from "../../common/types/pieces.types";
import {
	CheckmateEventData,
	MoveListUpdateEventData,
	MoveMadeEventData,
	PositionListUpdateEventData,
	TimerChangedEventData,
} from "../types/gameEvents.types";
import { GameplayWebSocketEventTypes } from "../types/gameEvents.enums";

interface MultiplayerGameplayWebsocketHookProps {
	gameId: number;
	parsedFEN: ParsedFEN;
	handleMoveMade: (eventData: MoveMadeEventData) => void;
	handleMoveListUpdated: (eventData: MoveListUpdateEventData) => void;
	handlePositionListUpdated: (eventData: PositionListUpdateEventData) => void;
	handleCheckmate: (eventData: CheckmateEventData) => void;
	handleDraw: (drawCause: string) => void;
	handlePlayerTimeout: (eventData: any) => void;
	handleTimerChanged: (eventData: TimerChangedEventData) => void;

	performPostPromotionCleanup: () => void;
}

function useMultiplayerGameplayWebsocket({
	gameId,
	parsedFEN,
	handleMoveMade,
	handlePositionListUpdated,
	handleMoveListUpdated,
	handleCheckmate,
	handlePlayerTimeout,
	handleTimerChanged,
	handleDraw,
	performPostPromotionCleanup,
}: MultiplayerGameplayWebsocketHookProps) {
	const gameWebsocketUrl = `${websocketBaseURL}/ws/game-server/?token=${getAccessToken()}&gameId=${gameId}`;
	const { socketRef: gameWebsocketRef } = useWebsocketWithLifecycle({
		url: gameWebsocketUrl,
		onMessage: handleOnMessage,
		enabled: true,
	});

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

		performPostPromotionCleanup();
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
				handleDraw("Repetition");
				break;

			case GameplayWebSocketEventTypes.FIFTY_MOVE_RULE_DETECTED:
				handleDraw("50-move-rule");
				break;

			case GameplayWebSocketEventTypes.INSUFFICIENT_MATERIAL:
				handleDraw("Insufficient material");
				break;

			case GameplayWebSocketEventTypes.PLAYER_TIMEOUT:
				handlePlayerTimeout(eventData);
				break;

			default:
				break;
		}
	}

	return { sendRegularMove, sendPromotionMove };
}

export default useMultiplayerGameplayWebsocket;
