import { BaseWebsocketEventData } from "../../shared/types/websocket.types";
import { TimeControl } from "../../shared/types/time.types";
import { PieceColor } from "../../shared/types/pieces.types";
import { ChallengeRelationships } from "./challengerInfo.types";

interface ChallengeReceivedWebsocketEventData extends BaseWebsocketEventData {
	challenge_sender: string;
	relationship: ChallengeRelationships;
	challenge_time_control: TimeControl;
}

interface ChallengeSuccessfullySentEventData extends BaseWebsocketEventData {
	challenge_time_control: TimeControl;
}

interface ChallengeAcceptedWebsocketEventData extends BaseWebsocketEventData {
	game_id: number;
	base_time: number;
	increment: number;
	assigned_color: PieceColor;

	white_player_username: string;
	black_player_username: string;
}

export type {
	ChallengeReceivedWebsocketEventData,
	ChallengeSuccessfullySentEventData,
	ChallengeAcceptedWebsocketEventData,
};
