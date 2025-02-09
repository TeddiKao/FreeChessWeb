import { useEffect, useState, useRef } from "react";
import api from "../../api.js";
import { displayTimeControl } from "../../utils/timeUtils";

import useWebSocket from "../../hooks/useWebsocket.js";

import "../../styles/matchmaking/matchmaking-screen.css";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../utils/tokenUtils.js";
import { getUsername } from "../../utils/apiUtils.js";

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
    const whitePlayerRef = useRef(null);
    const blackPlayerRef = useRef(null);

    const matchmakingWebsocketRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function onMatchFound() {
            if (matchFound) {
                const gameSetupInfo = {
                    baseTime,
                    increment,
                    gameId: gameIdRef.current,
                    assignedColor: await getAssignedColor(),
                };
                
                navigate("/play", {
                    state: gameSetupInfo,
                });
            }
        }

        onMatchFound();
    }, [matchFound, setMatchFound, navigate]);

    useEffect(() => {
        if (isMatchmaking) {
            if (!websocketConnected) {
                const websocketURL = `ws://localhost:8000/ws/matchmaking-server/?token=${getAccessToken()}`;
                const matchmakingWebsocket = useWebSocket(
                    websocketURL,
                    onMessage,
                    onError
                );

                matchmakingWebsocketRef.current = matchmakingWebsocket;
            }
        }

        return () => {
            if (
                matchmakingWebsocketRef.current?.readyState === WebSocket.OPEN
            ) {
                matchmakingWebsocketRef.current.close();
            }
        };
    }, []);

    function onMessage(event) {
        const parsedEventData = JSON.parse(event.data);

        if (parsedEventData["match_found"]) {
            handleMatchFound(parsedEventData);
        }
    }

    async function getAssignedColor() {
        const username = await getUsername();
        const assignedColor = username === whitePlayerRef.current ? "White" : "Black";

        return assignedColor;
    }

    function handleMatchFound(parsedEventData) {
        matchmakingWebsocketRef.current?.close();

        setMatchmakingStatus("Match found");

        setWebsocketConnected(() => false);
        setIsMatchmaking(() => false);

        matchFoundRef.current = true;
        gameIdRef.current = parsedEventData["game_id"];

        const whitePlayer = parsedEventData["white_player"];
        const blackPlayer = parsedEventData["black_player"];

        whitePlayerRef.current = whitePlayer;
        blackPlayerRef.current = blackPlayer;

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
