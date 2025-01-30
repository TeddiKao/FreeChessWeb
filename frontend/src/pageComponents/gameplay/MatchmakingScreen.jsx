import { useEffect, useState } from "react";
import api from "../../api.js";
import { displayTimeControl } from "../../utils/timeUtils";

import useWebSocket from "../../hooks/useWebsocket.js";

import "../../styles/matchmaking-screen.css";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../utils/tokenUtils.js";

function MatchmakingScreen({
    timeControlInfo: { baseTime, increment },
    setGameSetupStage,
}) {
    const [matchmakingStatus, setMatchmakingStatus] = useState("Finding match");
    const [isMatchmaking, setIsMatchmaking] = useState(true);
    const [websocketConnected, setWebsocketConnected] = useState(false);

    const websocketURL = `ws://localhost:8000/ws/matchmaking-server/?token=${getAccessToken()}`;
    const matchmakingWebsocket = useWebSocket(websocketURL, onMessage, onError);

    const [websocket, setWebsocket] = useState(matchmakingWebsocket);

    function onMessage(event) {
        console.log(event.data)
    }

    function onError(event) {}

    const navigate = useNavigate();

    function initiateWebsocketConnection() {
        setWebsocket(websocket);
    }

    async function findMatch() {
        try {
            const response = await api.post("/matchmaking_api/match-player/");
            if (response.data["player_found"]) {
                setMatchmakingStatus("Found player");
                setIsMatchmaking(false);
                navigate("/play", { state: { baseTime, increment } });
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        let findMatchInterval = null;

        if (isMatchmaking) {
            if (!websocketConnected) {
                initiateWebsocketConnection();
                setWebsocketConnected(true);
            }
        } else {
            // if (findMatchInterval) {
            //     clearInterval(findMatchInterval);
            // }
        }

        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }

            if (findMatchInterval) {
                clearInterval(findMatchInterval);
            }
        };
    }, []);

    function handleMatchmakingCancel() {
        setIsMatchmaking(false);
        setGameSetupStage("timeControlSelection");
    }

    return (
        <div className="matchmaking-screen-container">
            <h1 className="matchmaking-heading">{matchmakingStatus}</h1>
            <p className="matchmaking-time-control">
                {displayTimeControl({ baseTime, increment })}
            </p>
            <button
                onClick={handleMatchmakingCancel}
                className="cancel-matchmaking"
            >
                Cancel
            </button>
        </div>
    );
}

export default MatchmakingScreen;
