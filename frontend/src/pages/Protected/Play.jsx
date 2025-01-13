import React, { useEffect, useState } from "react";

import DisplayChessboard from "../../globalComponents/DisplayChessboard.jsx";
import TimeControlTypeContainer from "../../pageComponents/gameplay/TimeControlTypeContainer.jsx";
import Timer from "../../pageComponents/gameplay/Timer.jsx";

import "../../styles/play.css";

import { fetchFen } from "../../utils.js";
import {
    bulletTimeControls,
    blitzTimeControls,
    rapidTimeControls,
    classicalTimeControls,
} from "../../constants/timeControls.js";
import TimeControlSelection from "../../pageComponents/gameplay/TimeControlSelection.jsx";

function Play() {
    const [parsedFEN, setParsedFEN] = useState("");
    const [timeControlSelectionStage, setTimeControlSelectionStage] =
        useState("typeSelection");

    const [selectedTimeControlType, setSelectedTimeControlType] = useState("");

    useEffect(() => {
        getParsedFEN();
    }, []);

    const startingPositionFEN =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    async function getParsedFEN() {
        try {
            const parsedFEN = await fetchFen(startingPositionFEN);
            setParsedFEN(parsedFEN);
        } catch (error) {
            console.log(error);
        }
    }

    function renderTimeControlSelectionPanel() {
        console.log(timeControlSelectionStage);
        switch (timeControlSelectionStage) {
            case "typeSelection":
                const bulletDescription =
                    "Great for users who enjoy fast-paced and exciting games";

                const blitzDescription =
                    "Great for practising new chess openings";
                const rapidDescription =
                    "The perfect balance of speed and strategy";
                const classicalDescription =
                    "Perfect for those with plenty of time to focus on a long game";

                const customDescription =
                    "Choose a time control that suits your mood and skill level";

                return (
                    <div className="time-control-type-container">
                        <TimeControlTypeContainer
                            timeControlName="Bullet"
                            timeControlDescription={bulletDescription}
                            setSelectionStage={setTimeControlSelectionStage}
                            setType={setSelectedTimeControlType}
                        />

                        <TimeControlTypeContainer
                            timeControlName="Blitz"
                            timeControlDescription={blitzDescription}
                            setSelectionStage={setTimeControlSelectionStage}
                            setType={setSelectedTimeControlType}
                        />

                        <TimeControlTypeContainer
                            timeControlName="Rapid"
                            timeControlDescription={classicalDescription}
                            setSelectionStage={setTimeControlSelectionStage}
                            setType={setSelectedTimeControlType}
                        />

                        <TimeControlTypeContainer
                            timeControlName="Classical"
                            timeControlDescription={classicalDescription}
                            setSelectionStage={setTimeControlSelectionStage}
                            setType={setSelectedTimeControlType}
                        />

                        <TimeControlTypeContainer
                            timeControlName="Custom"
                            timeControlDescription={customDescription}
                            setSelectionStage={setTimeControlSelectionStage}
                            setType={setSelectedTimeControlType}
                        />
                    </div>
                );

            case "amountSelection":
                const timeControlType = selectedTimeControlType.toLowerCase();
                return (
                    <div className="time-control-amount-container">
                        <TimeControlSelection timeControlType={timeControlType} />
                    </div>
                );

            case "startConfirmation":
                <div className="start-confirmation-container"></div>;
        }
    }

    return (
        <div className="playing-interface-container">
            <div className="display-chessboard-container">
                <div className="top-timer-wrapper">
                    <Timer playerColor="black" position="top" />
                </div>

                <DisplayChessboard fenString={parsedFEN} orientation="White" />

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
