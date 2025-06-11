import { TimeControl } from "./gameSetup";

type ChallengeRelationships = "Recent opponent" | "Unknown";

type ChallengeWebsocketEventData = {
    type: string;
    challenge_recepient: string;
    relationship: ChallengeRelationships;
    challenge_time_control: TimeControl;
}

export type { ChallengeRelationships, ChallengeWebsocketEventData }