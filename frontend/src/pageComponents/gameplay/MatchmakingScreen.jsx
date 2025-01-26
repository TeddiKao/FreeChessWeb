import { useEffect, useState } from "react";
import api from "../../api.js";
import { displayTimeControl } from "../../utils/timeUtils";

import "../../styles/matchmaking-screen.css"

function MatchmakingScreen({ timeControlInfo: { baseTime, increment } }) {
    const [matchmakingStatus, setMatchmakingStatus] = useState("Finding match");

    useEffect(() => {
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

        const findMatchInterval = setInterval(() => {
            findMatch().catch((error) => {
                console.log(error);
            });
        }, 1000);

        return () => {
            clearInterval(findMatchInterval);
        };
    }, []);

    return (
        <div className="matchmaking-screen-container">
            <h1 className="matchmaking-heading">{matchmakingStatus}</h1>
            <p className="matchmaking-time-control">
                {displayTimeControl({ baseTime, increment })}
            </p>
			<button className="cancel-matchmaking">Cancel</button>
        </div>
    );
}

export default MatchmakingScreen;
