import { ChallengeRelationships } from "../types/challenge";
import { TimeControl } from "../types/gameSetup";
import { BasicWebSocketEventData } from "./general";

interface ChallengeWebsocketEventData extends BasicWebSocketEventData {
    challenge_sender: string;
    relationship: ChallengeRelationships;
    challenge_time_control: TimeControl;
}

export type { ChallengeWebsocketEventData }