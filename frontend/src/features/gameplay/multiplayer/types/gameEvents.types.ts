import { BaseWebsocketEventData } from "../../../../shared/types/websocket.types";
import {
	CapturedPiecesList,
	MoveInfo,
	ParsedFEN,
	PromotedPiecesList,
} from "../../../../shared/types/chessTypes/gameState.types";
import { PieceColor } from "../../../../shared/types/chessTypes/pieces.types";

interface MoveMadeEventData extends BaseWebsocketEventData {
	move_data: MoveInfo;
	new_parsed_fen: ParsedFEN;
	move_made_by: string;
	move_type: string;
	new_position_index: number;
	new_side_to_move: PieceColor;
}

interface TimerChangedEventData extends BaseWebsocketEventData {
	white_player_clock: number;
	black_player_clock: number;
}

interface PositionListUpdateEventData extends BaseWebsocketEventData {
	new_position_list: Array<{
		position: ParsedFEN;
		last_dragged_square: string;
		last_dropped_square: string;
		move_type: string;
		move_info: MoveInfo;
		captured_material: {
			white: CapturedPiecesList;
			black: CapturedPiecesList;
		};
		promoted_pieces: {
			white: PromotedPiecesList;
			black: PromotedPiecesList;
		};
	}>;
}

interface CheckmateEventData extends BaseWebsocketEventData {
	winning_color: string;
}

interface MoveListUpdateEventData extends BaseWebsocketEventData {
	new_move_list: Array<Array<string>>;
}

export type {
	MoveMadeEventData,
	TimerChangedEventData,
	PositionListUpdateEventData,
	CheckmateEventData,
	MoveListUpdateEventData,
};
