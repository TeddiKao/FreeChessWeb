import React, { useEffect, useState } from "react";

import TimeControlTypeContainer from "../../features/gameSetup/TimeControlTypeContainer.js";
import TimeControlSelection from "../../features/gameSetup/TimeControlSelection.js";

import "../../styles/features/gameSetup/select-time-control.scss";

import { capitaliseFirstLetter } from "../../utils/generalUtils.ts";
import { displayTimeControl } from "../../utils/timeUtils.ts";
import { fetchFen } from "../../utils/apiUtils.ts";

import MatchmakingScreen from "../../features/gameSetup/MatchmakingScreen.js";
import { GameSetupStages } from "../../enums/gameSetup.js";
import { ParsedFENString } from "../../types/gameLogic.ts";
import CustomTimeControlScreen from "../../features/gameSetup/CustomTimeControlScreen.tsx";
import DashboardNavbar from "../../components/common/DashboardNavbar/DashboardNavbar.tsx";
import DisplayChessboard from "../../features1/gameplay/chessboards/DisplayChessboard.tsx";
import Timer from "../../features1/gameplay/Timer.tsx";

type TimeControlInfo = {
	baseTime: number;
	increment: number;
};

function GameSetup() {
	const [parsedFEN, setParsedFEN] = useState<ParsedFENString | null>(null);

	const [gameSetupStage, setGameSetupStage] = useState<string | null>(
		"timeControlSelection"
	);
	const [timeControlSelectionStage, setTimeControlSelectionStage] =
		useState<string>("typeSelection");

	const [selectedTimeControlType, setSelectedTimeControlType] = useState<
		string | null
	>(null);
	const [selectedTimeControl, setSelectedTimeControl] =
		useState<TimeControlInfo | null>(null);
	const [customTimeControlCreated, setCustomTimeControlCreated] =
		useState<boolean>(false);

	useEffect(() => {
		updateParsedFEN();
	}, []);

	async function handleStartClick() {
		setGameSetupStage("matchmaking");
	}

	const startingPositionFEN =
		"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

	async function updateParsedFEN() {
		try {
			const parsedFEN = await fetchFen(startingPositionFEN);
			setParsedFEN(parsedFEN);
		} catch (error) {
			console.log(error);
		}
	}

	if (!parsedFEN) {
		return null;
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
			case GameSetupStages.CONFIRM_START:
				if (!customTimeControlCreated) {
					return GameSetupStages.AMOUNT_SELECT;
				} else {
					return GameSetupStages.CUSTOM_TIME_CREATE;
				}

			case GameSetupStages.CUSTOM_TIME_CREATE:
			case GameSetupStages.AMOUNT_SELECT:
				return GameSetupStages.TYPE_SELECT;
		}
	}

	function handleGoBack() {
		const stageToRedirect = getPreviousTimeControlSelectionStage();
		if (!stageToRedirect) {
			return;
		}

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
					setSelectedTimeControl={setSelectedTimeControl}
					setCustomTimeControlCreated={setCustomTimeControlCreated}
				/>

				<TimeControlTypeContainer
					timeControlName="Blitz"
					timeControlDescription={blitzDescription}
					setSelectionStage={setTimeControlSelectionStage}
					setType={setSelectedTimeControlType}
					setSelectedTimeControl={setSelectedTimeControl}
					setCustomTimeControlCreated={setCustomTimeControlCreated}
				/>

				<TimeControlTypeContainer
					timeControlName="Rapid"
					timeControlDescription={rapidDescription}
					setSelectionStage={setTimeControlSelectionStage}
					setType={setSelectedTimeControlType}
					setSelectedTimeControl={setSelectedTimeControl}
					setCustomTimeControlCreated={setCustomTimeControlCreated}
				/>

				<TimeControlTypeContainer
					timeControlName="Classical"
					timeControlDescription={classicalDescription}
					setSelectionStage={setTimeControlSelectionStage}
					setType={setSelectedTimeControlType}
					setSelectedTimeControl={setSelectedTimeControl}
					setCustomTimeControlCreated={setCustomTimeControlCreated}
				/>

				<TimeControlTypeContainer
					timeControlName="Custom"
					timeControlDescription={customDescription}
					setSelectionStage={setTimeControlSelectionStage}
					setType={setSelectedTimeControlType}
					setSelectedTimeControl={setSelectedTimeControl}
					setCustomTimeControlCreated={setCustomTimeControlCreated}
				/>
			</div>
		);
	}

	function showTimeControlAmounts() {
		if (!selectedTimeControlType) {
			return null;
		}

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
		if (!selectedTimeControl) {
			return null;
		}

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
			case GameSetupStages.TYPE_SELECT:
				return showTimeControlTypes();

			case GameSetupStages.AMOUNT_SELECT:
				return showTimeControlAmounts();

			case GameSetupStages.CUSTOM_TIME_CREATE:
				return (
					<CustomTimeControlScreen
						handleGoBack={handleGoBack}
						setCustomTimeControlCreated={
							setCustomTimeControlCreated
						}
						setSelectedTimeControl={setSelectedTimeControl}
						setSelectionStage={setTimeControlSelectionStage}
					/>
				);

			case GameSetupStages.CONFIRM_START:
				return showStartConfirmationScreen();
		}
	}

	const baseTime = selectedTimeControl?.baseTime;
	const timerWrapperStyles = { width: "440px" };

	return (
		<>
			<DashboardNavbar />
			<div className="time-control-selection-interface-container">
				<div className="display-chessboard-container">
					<div
						style={timerWrapperStyles}
						className="top-timer-wrapper"
					>
						<Timer
							playerColor="black"
							timeInSeconds={baseTime || 3600}
							startingTimeInSeconds={baseTime || 3600}
						/>
					</div>

					<DisplayChessboard
						parsed_fen_string={parsedFEN}
						orientation="White"
					/>

					<div
						style={timerWrapperStyles}
						className="bottom-timer-wrapper"
					>
						<Timer
							playerColor="white"
							timeInSeconds={baseTime || 3600}
							startingTimeInSeconds={baseTime || 3600}
						/>
					</div>
				</div>

				{renderGameSetupPanel()}
			</div>
		</>
	);
}

export default GameSetup;
