import { useEffect, useState, useRef } from "react";
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
    const [matchFound, setMatchFound] = useState(false);

    const matchFoundRef = useRef(null);
    const gameIdRef = useRef(null);

    const websocketURL = `ws://localhost:8000/ws/matchmaking-server/?token=${getAccessToken()}`;
    const matchmakingWebsocket = useWebSocket(websocketURL, onMessage, onError);

    const [websocket, setWebsocket] = useState(matchmakingWebsocket);

    const navigate = useNavigate();

    useEffect(() => {
        if (matchFound) {
            navigate("/play", {
                state: { baseTime, increment, gameId: gameIdRef.current },
            });
        }
    }, [matchFound, setMatchFound, navigate]);

    useEffect(() => {
        if (isMatchmaking) {
            if (!websocketConnected) {
                setWebsocketConnected(true);
            }
        }

        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
        };
    }, []);

    function onMessage(event) {
        const parsedEventData = JSON.parse(event.data);

        if (parsedEventData["match_found"]) {
            handleMatchFound(parsedEventData);
        }
    }

    function handleMatchFound(parsedEventData) {
        websocket.close();

        setMatchmakingStatus("Match found");

        setWebsocketConnected(() => false);
        setIsMatchmaking(() => false);

        matchFoundRef.current = true;
        gameIdRef.current = parsedEventData["game_id"]

        setTimeout(() => {
            setMatchFound(true);
        }, 50);
    }

    function onError(event) {
        console.log("Error!");
    }

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
