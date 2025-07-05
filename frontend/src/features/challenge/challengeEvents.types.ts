import { BasicWebSocketEventData } from "../../interfaces/general";
import { TimeControl } from "../../shared/types/time.types";
import { PieceColor } from "../gameplay/common/types/pieces.types";
import { ChallengeRelationships } from "./challengerInfo.types";

interface ChallengeReceivedWebsocketEventData extends BasicWebSocketEventData {
	challenge_sender: string;
	relationship: ChallengeRelationships;
	challenge_time_control: TimeControl;
}

interface ChallengeSuccessfullySentEventData extends BasicWebSocketEventData {
	challenge_time_control: TimeControl;
}

interface ChallengeAcceptedWebsocketEventData extends BasicWebSocketEventData {
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
