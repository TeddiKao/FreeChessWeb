import { BasrWebsocketEventData } from "../../shared/types/websocket.types";
import { TimeControl } from "../../shared/types/time.types";
import { PieceColor } from "../gameplay/common/types/pieces.types";
import { ChallengeRelationships } from "./challengerInfo.types";

interface ChallengeReceivedWebsocketEventData extends BasrWebsocketEventData {
	challenge_sender: string;
	relationship: ChallengeRelationships;
	challenge_time_control: TimeControl;
}

interface ChallengeSuccessfullySentEventData extends BasrWebsocketEventData {
	challenge_time_control: TimeControl;
}

interface ChallengeAcceptedWebsocketEventData extends BasrWebsocketEventData {
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
