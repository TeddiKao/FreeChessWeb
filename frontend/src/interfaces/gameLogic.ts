import { MoveInfo, ParsedFENString } from "../types/gameLogic";
import { BasicWebSocketEventData } from "./general.ts";

interface MoveMadeEventData extends BasicWebSocketEventData {
	move_data: MoveInfo,
	new_parsed_fen: ParsedFENString,
	move_type: string,
	new_position_index: number,
}

interface TimerChangedEventData extends BasicWebSocketEventData {
	white_player_clock: number,
	black_player_clock: number
}

interface PositionListUpdateEventData extends BasicWebSocketEventData {
	new_position_list: Array<ParsedFENString>
}

export type { MoveMadeEventData, TimerChangedEventData, PositionListUpdateEventData }