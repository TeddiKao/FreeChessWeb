import { useEffect, useState } from "react";
import api from "../../api.js";
import { displayTimeControl } from "../../utils/timeUtils";

import "../../styles/matchmaking-screen.css"

function MatchmakingScreen({ timeControlInfo: { baseTime, increment }, setGameSetupStage }) {
    const [matchmakingStatus, setMatchmakingStatus] = useState("Finding match");
    const [isMatchmaking, setIsMatchmaking] = useState(true);

    async function findMatch() {
        try {
            const response = await api.post(
                "/matchmaking_api/match-player/"
            );
            if (response.data["player_found"]) {
                setMatchmakingStatus("Found player");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        let findMatchInterval = null;

        if (isMatchmaking) {
            findMatchInterval = setInterval(() => {

                findMatch().catch((error) => {
                    console.log(error);
                    clearInterval(findMatchInterval)
                });
            }, 1000);
        } else {
            if (findMatchInterval) {
                clearInterval(findMatchInterval);
            }
        }

        return () => {
            clearInterval(findMatchInterval);
        };
    }, [isMatchmaking]);

    function handleMatchmakingCancel() {
        setIsMatchmaking(false);
        setGameSetupStage("timeControlSelection")
    }

    return (
        <div className="matchmaking-screen-container">
            <h1 className="matchmaking-heading">{matchmakingStatus}</h1>
            <p className="matchmaking-time-control">
                {displayTimeControl({ baseTime, increment })}
            </p>
			<button onClick={handleMatchmakingCancel} className="cancel-matchmaking">Cancel</button>
        </div>
    );
}

export default MatchmakingScreen;
