import useWebsocketWithLifecycle from "@/shared/hooks/websocket/useWebsocketWithLifecycle";
import { parseWebsocketUrl } from "@/shared/utils/generalUtils";
import { BotCheckmateEventData } from "../types/botGameEvents.types";
import { BotGameWebSocketEventTypes } from "../types/botGameEvents.enums";
import { ChessboardSquareIndex } from "@/shared/types/chessTypes/board.types";
import { PieceType } from "@/shared/types/chessTypes/pieces.types";
import { ParsedFEN } from "@/shared/types/chessTypes/gameState.types";

interface BotGameplayWebsocketHookProps {
    gameId: number;
    parsedFEN: ParsedFEN;
    functionCallbacks: {
        handleCheckmate: (data: BotCheckmateEventData) => void;
        handleDraw: (drawCause: string) => void;
        handlePlayerMoveMade: (data: any) => void;
        handleBotMoveMade: (data: any) => void;
        performPostPromotionCleanup: () => void;
    };
}

function useBotGameplayWebsocket({
    gameId,
    parsedFEN,
    functionCallbacks: {
        handleCheckmate,
        handleDraw,
        handlePlayerMoveMade,
        handleBotMoveMade,
        performPostPromotionCleanup,
    },
}: BotGameplayWebsocketHookProps) {
    const websocketUrl = parseWebsocketUrl("bot-game-server", {
        gameId: gameId,
    });

    const { socketRef } = useWebsocketWithLifecycle({
        url: websocketUrl,
        enabled: true,
        onMessage: handleOnMessage,
    });

    function sendMessage(messageContent: any) {
        socketRef?.current?.send(JSON.stringify(messageContent));
    }

    function handleOnMessage(event: MessageEvent) {
        const parsedEventData = JSON.parse(event.data);
        const eventType = parsedEventData["type"];

        switch (eventType) {
            case BotGameWebSocketEventTypes.CHECKMATE_OCCURRED:
                handleCheckmate(parsedEventData);
                break;

            case BotGameWebSocketEventTypes.STALEMATE_OCCURRED:
                handleDraw("stalemate");
                break;

            case BotGameWebSocketEventTypes.THREEFOLD_REPETITION_OCCURRED:
                handleDraw("repetition");
                break;

            case BotGameWebSocketEventTypes.FIFTY_MOVE_RULE_REACHED:
                handleDraw("50-move rule");
                break;

            case BotGameWebSocketEventTypes.MOVE_REGISTERED:
                handlePlayerMoveMade(parsedEventData);
                break;

            case BotGameWebSocketEventTypes.BOT_MOVE_MADE:
                handleBotMoveMade(parsedEventData);
                break;
        }
    }

    function sendPromotionMove(
        originalPawnSquare: ChessboardSquareIndex,
        promotionSquare: ChessboardSquareIndex,
        promotedPiece: PieceType,
    ) {
        if (!parsedFEN) return;

        const boardPlacement = parsedFEN["board_placement"];
        const squareInfo = boardPlacement[originalPawnSquare.toString()];
        const pieceType = squareInfo["piece_type"];
        const pieceColor = squareInfo["piece_color"];

        const moveInfo = {
            piece_type: pieceType,
            piece_color: pieceColor,
            starting_square: originalPawnSquare.toString(),
            destination_square: promotionSquare?.toString(),

            additional_info: {
                promoted_piece: promotedPiece,
            },
        };

        sendMessage({
            type: "move_made",
            move_info: moveInfo,
        });

        performPostPromotionCleanup();
    }

    return { sendMessage, sendPromotionMove };
}

export default useBotGameplayWebsocket;
