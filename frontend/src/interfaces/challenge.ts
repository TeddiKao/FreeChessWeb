import { ChallengeRelationships } from "../types/challenge";
import { PieceColor } from "../types/gameLogic";
import { TimeControl } from "../types/gameSetup";
import { BasicWebSocketEventData } from "./general";

interface ChallengeSentWebsocketEventData extends BasicWebSocketEventData {
    challenge_sender: string;
    relationship: ChallengeRelationships;
    challenge_time_control: TimeControl;
}

interface ChallengeAcceptedWebsocketEventData extends BasicWebSocketEventData {
    game_id: number;
    base_time: number;
    increment: number;
    assigned_color: PieceColor;
}

export type { ChallengeSentWebsocketEventData, ChallengeAcceptedWebsocketEventData }