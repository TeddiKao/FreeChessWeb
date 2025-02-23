import React, { useEffect, useState } from "react";

import DisplayChessboard from "../../globalComponents/chessboards/DisplayChessboard.js";

import TimeControlTypeContainer from "../../pageComponents/gameplay/TimeControlTypeContainer.js";
import Timer from "../../pageComponents/gameplay/Timer.js";
import TimeControlSelection from "../../pageComponents/gameplay/TimeControlSelection.js";

import "../../styles/matchmaking/select-time-control.css";

import { capitaliseFirstLetter } from "../../utils/generalUtils.js";
import { displayTimeControl } from "../../utils/timeUtils.js";
import { fetchFen } from "../../utils/apiUtils.js";

import MatchmakingScreen from "../../pageComponents/gameplay/MatchmakingScreen.js";
import { GameSetupStages } from "../../enums/gameSetup.js";

type TimeControlInfo = {
    baseTime: number,
    increment: number,
}

function GameSetup() {
    const [parsedFEN, setParsedFEN] = useState<object | null>(null);

    const [gameSetupStage, setGameSetupStage] = useState<string | null>(
        "timeControlSelection"
    );
    const [timeControlSelectionStage, setTimeControlSelectionStage] = useState<
        string | null
    >("typeSelection");

    const [selectedTimeControlType, setSelectedTimeControlType] = useState<object | null>(null);
    const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControlInfo | null>(null);

    useEffect(() => {
        getParsedFEN();
    }, []);

    async function handleStartClick() {
        setGameSetupStage("matchmaking");
    }

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

    function renderGameSetupPanel() {
        switch (gameSetupStage) {
            case "timeControlSelection":
                return (
                    <div className="time-control-selection-container">
                        {renderTimeControlSelectionPanel()}
                    </div>
                );

            case "matchmaking":
                if (!selectedTimeControl) {
                    return null;
                }

                return (
                    <MatchmakingScreen
                        timeControlInfo={{
                            baseTime: selectedTimeControl.baseTime,
                            increment: selectedTimeControl.increment,
                        }}
                        setGameSetupStage={setGameSetupStage}
                    />
                );
        }
    }

    function getPreviousTimeControlSelectionStage() {
        switch (timeControlSelectionStage) {
            case GameSetupStages.START_CONFIRMATION:
                return GameSetupStages.AMOUNT_SELECTION;

            case GameSetupStages.AMOUNT_SELECTION:
                return GameSetupStages.TYPE_SELECTION;
        }
    }

    function handleGoBack() {
        const stageToRedirect = getPreviousTimeControlSelectionStage();
        setTimeControlSelectionStage(stageToRedirect);
    }

    function showTimeControlTypes() {
        const bulletDescription =
            "Great for users who enjoy fast-paced and exciting games";

        const blitzDescription = "Great for practising new chess openings";
        const rapidDescription = "The perfect balance of speed and strategy";
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
                    timeControlDescription={rapidDescription}
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
    }

    function showTimeControlAmounts() {
        const timeControlType = selectedTimeControlType.toLowerCase();
        return (
            <div className="time-control-amount-selection-container">
                <h1 className="time-control-type-header">
                    {capitaliseFirstLetter(timeControlType)}
                </h1>
                <div className="time-control-amount-container">
                    <TimeControlSelection
                        timeControlType={timeControlType}
                        selectedTimeControl={selectedTimeControl}
                        setTimeControl={setSelectedTimeControl}
                    />
                </div>

                {selectedTimeControl ? (
                    <button
                        onClick={() => {
                            setTimeControlSelectionStage("startConfirmation");
                        }}
                        className="continue-button"
                    >
                        Continue
                    </button>
                ) : null}

                <p onClick={handleGoBack} className="go-back-button">
                    Go back
                </p>
            </div>
        );
    }

    function showStartConfirmationScreen() {
        return (
            <div className="start-confirmation-container">
                <p className="time-control">
                    {displayTimeControl(selectedTimeControl)}
                </p>
                <button
                    className="start-game-button"
                    onClick={() => {
                        handleStartClick();
                    }}
                >
                    Start game
                </button>
                <p onClick={handleGoBack} className="go-back-button">
                    Go back
                </p>
            </div>
        );
    }

    function renderTimeControlSelectionPanel() {
        switch (timeControlSelectionStage) {
            case GameSetupStages.TYPE_SELECTION:
                return showTimeControlTypes();

            case GameSetupStages.AMOUNT_SELECTION:
                return showTimeControlAmounts();

            case GameSetupStages.START_CONFIRMATION:
                return showStartConfirmationScreen();
        }
    }

    return (
        <div className="time-control-selection-interface-container">
            <div className="display-chessboard-container">
                <div className="top-timer-wrapper">
                    <Timer
                        playerColor="black"
                        position="top"
                        timeInSeconds={3600}
                    />
                </div>

                <DisplayChessboard fenString={parsedFEN} orientation="White" />

                <div className="bottom-timer-wrapper">
                    <Timer
                        playerColor="white"
                        position="bottom"
                        timeInSeconds={3600}
                    />
                </div>
            </div>

            {renderGameSetupPanel()}
        </div>
    );
}

export default GameSetup;
