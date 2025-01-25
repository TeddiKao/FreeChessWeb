import { Navigate, useLocation } from "react-router-dom";

import Chessboard from "../../globalComponents/Chessboard";
import Timer from "../../pageComponents/gameplay/Timer.jsx";

import "../../styles/play.css";

import { fetchFen } from "../../utils/apiUtils.js";

import React, { useEffect, useState } from "react";

function Play() {
    const [parsedFEN, setParsedFEN] = useState(null);
    const location = useLocation();

    useEffect(() => {
        getParsedFEN();
    }, []);

    if (!location.state) {
        return <Navigate to={"/select-time-control"} />;
    }

    const timeControlBaseTime = location.state.baseTime;
    const timeControlIncrement = location.state.increment;

    const startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    async function getParsedFEN() {
        try {
            const fetchedFEN = await fetchFen(startingPositionFEN);
            setParsedFEN(fetchedFEN);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="playing-interface-container">
            <div className="top-timer-wrapper">
                <Timer
                    playerColor="black"
                    position="top"
                    timeInSeconds={timeControlBaseTime}
                />
            </div>

            <Chessboard parsed_fen_string={parsedFEN} orientation="White" />

            <div className="bottom-timer-wrapper">
                <Timer
                    playerColor="white"
                    position="bottom"
                    timeInSeconds={timeControlBaseTime}
                />
            </div>
        </div>
    );
}

export default Play;
