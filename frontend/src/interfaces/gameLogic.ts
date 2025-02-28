import { MoveInfo, ParsedFENString } from "../types/gameLogic";
import { BasicWebSocketEventData } from "./general.ts";

interface MoveMadeEventData extends BasicWebSocketEventData {
	move_data: MoveInfo,
	new_parsed_fen: ParsedFENString,
	move_type: string
}

interface TimerChangedEventData extends BasicWebSocketEventData {
	white_player_clock: number,
	black_player_clock: number
}

export type { MoveMadeEventData, TimerChangedEventData }