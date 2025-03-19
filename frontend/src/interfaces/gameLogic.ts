import { MoveInfo, ParsedFENString } from "../types/gameLogic";
import { BasicWebSocketEventData } from "./general.ts";

interface MoveMadeEventData extends BasicWebSocketEventData {
    move_data: MoveInfo;
    new_parsed_fen: ParsedFENString;
    move_type: string;
    new_position_index: number;
}

interface TimerChangedEventData extends BasicWebSocketEventData {
    white_player_clock: number;
    black_player_clock: number;
}

interface PositionListUpdateEventData extends BasicWebSocketEventData {
    new_position_list: Array<{
        position: ParsedFENString;
        last_dragged_square: string;
        last_dropped_square: string;
    }>;
}

interface CheckmateEventData extends BasicWebSocketEventData {
    winning_color: string;
}

interface MoveListUpdateEventData extends BasicWebSocketEventData {
	new_move_list: Array<Array<string>>
}

export type {
    MoveMadeEventData,
    TimerChangedEventData,
    PositionListUpdateEventData,
	CheckmateEventData,
	MoveListUpdateEventData
};
