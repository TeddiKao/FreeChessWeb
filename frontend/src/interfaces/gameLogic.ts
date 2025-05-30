import { MoveInfo, ParsedFENString } from "../types/gameLogic";
import { BasicWebSocketEventData } from "./general.ts";
import { CapturedPiecesList } from "./materialCalculation.ts";

interface MoveMadeEventData extends BasicWebSocketEventData {
    move_data: MoveInfo;
    new_parsed_fen: ParsedFENString;
    move_made_by: string,
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
        move_type: string;
        move_info: MoveInfo;
        captured_material: {
            white: CapturedPiecesList;
            black: CapturedPiecesList;
        };
        promoted_pieces: {
            white: CapturedPiecesList;
            black: CapturedPiecesList;
        }
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
