import { ReactNode } from "react";

type ChallengeWebsocketProviderProps = {
    children: ReactNode;
}

function ChallengeWebsocketProvider({ children }: ChallengeWebsocketProviderProps) {
    return children;
}

export default ChallengeWebsocketProvider;