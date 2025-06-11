import { TimeControl } from "./gameSetup";

type ChallengeRelationships = "Recent opponent" | "Unknown";

type ChallengeWebsocketEventData = {
    type: string;
    challenge_sender: string;
    relationship: ChallengeRelationships;
    challenge_time_control: TimeControl;
}

export type { ChallengeRelationships, ChallengeWebsocketEventData }