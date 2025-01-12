import React, { useEffect, useState } from "react";

import Timer from "../../pageComponents/gameplay/Timer.jsx";

import "../../styles/play.css";
import DisplayChessboard from "../../globalComponents/DisplayChessboard.jsx";
import { fetchFen } from "../../utils.js";

function Play() {
    const [parsedFEN, setParsedFEN] = useState("");
    const [timeControlSelectionStage, setTimeControlSelectionStage] =
        useState("typeSelection");

    useEffect(() => {
        getParsedFEN();
    }, []);

    const startingPositionFEN =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    async function getParsedFEN() {
        try {
            const parsedFEN = await fetchFen(startingPositionFEN);
            console.log(parsedFEN);
            setParsedFEN(parsedFEN);

        } catch (error) {
            console.log(error);
        }
    }

    function renderTimeControlSelectionPanel() {
        switch(timeControlSelectionStage) {
            case "typeSelection": 
                return (
                    <div className="time-control-type-container">
                        <div className="bullet">
                            <h1>Bullet</h1>
                            <p>Great for users who enjoy fast-paced and exciting games</p>
                        </div>

                        <div className="blitz">
                            <h1>Blitz</h1>
                            <p>Great for practising new chess openings</p>
                        </div>

                        <div className="rapid">
                            <h1>Rapid</h1>
                            <p>The perfect balance of speed and strategy</p>
                        </div>

                        <div className="classical">
                            <h1>Classical</h1>
                            <p>Perfect for those with plenty of time to focus on a long game</p>
                        </div>

                        <div className="custom">
                            <h1>Custom</h1>
                            <p>Choose a time control that suits your mood and skill level</p>
                        </div>
                    </div>
                )

            case "amountSelection":
                return (
                    <div className="time-control-amount-container">

                    </div>
                )

            case "startConfirmation":
                <div className="start-confirmation-container"></div>
        }
    }

    return (
        <div className="playing-interface-container">
            <div className="display-chessboard-container">
                <div className="top-timer-wrapper">
                    <Timer playerColor="black" position="top" />
                </div>

                <DisplayChessboard fenString={parsedFEN} orientation="White"/>

                <div className="bottom-timer-wrapper">
                    <Timer playerColor="white" position="bottom" />
                </div>
            </div>

            <div className="time-control-selection-container">
                {renderTimeControlSelectionPanel()}
            </div>
        </div>
    );
}

export default Play;
