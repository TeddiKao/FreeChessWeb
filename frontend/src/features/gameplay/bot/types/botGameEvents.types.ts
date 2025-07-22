import { BaseWebsocketEventData } from "@/shared/types/websocket.types";
import { PieceColor } from "@sharedTypes/chessTypes/pieces.types";

interface BotCheckmateEventData extends BaseWebsocketEventData {
	winning_color: PieceColor;
    game_winner: string;
}   

export type { BotCheckmateEventData }