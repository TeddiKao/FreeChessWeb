import React, { useState, useEffect } from "react";
import { fetchFen } from "../../../../utils/apiUtils.js";

import {
	GameEndedSetterContext,
	GameEndedCauseSetterContext,
	GameWinnerSetterContext,
} from "../../../../contexts/chessboardContexts.js";

import "../../styles/components/chessboard/board-actions.scss";
import "../../styles/pages/pass-and-play.scss";

import Chessboard from "../Chessboard.tsx";
import GameplaySettings from "../../../../features1/modals/GameplaySettings.tsx";
import ModalWrapper from "../../../../components/wrappers/ModalWrapper.tsx";
import useGameplaySettings from "../../../../hooks/useGameplaySettings.ts";
import { ParsedFENString } from "../../../../types/gameLogic.ts";
import DashboardNavbar from "../../../../components/common/DashboardNavbar/DashboardNavbar.tsx";
import LocalGameOverModal from "../../../../features1/modals/gameOverModals/LocalModal.tsx";

function PassAndPlay() {
	const [parsedFEN, setParsedFEN] = useState<ParsedFENString | null>(null);

	const [gameEnded, setGameEnded] = useState<boolean>(false);
	const [gameEndedCause, setGameEndedCause] = useState<string>("");
	const [gameWinner, setGameWinner] = useState<string>("");

	const initialGameplaySettings = useGameplaySettings();
	const [gameplaySettings, setGameplaySettings] = useState(
		initialGameplaySettings
	);

	const [gameplaySettingsVisible, setGameplaySettingsVisible] =
		useState(false);

	const [boardOrientation, setBoardOrientation] = useState("White");

	useEffect(() => {
		getParsedFEN();
	}, []);

	useEffect(() => {
		setGameplaySettings(initialGameplaySettings);
	}, [initialGameplaySettings]);

	if (!initialGameplaySettings) {
		return null;
	}

	function handleSettingsClose() {
		setGameplaySettingsVisible(false);
	}

	function handleSettingsDisplay() {
		setGameplaySettingsVisible(true);
	}

	function toggleBoardOrientation() {
		const isWhite = boardOrientation.toLowerCase() === "white";
		const newOrientation = isWhite ? "Black" : "White";

		setBoardOrientation(newOrientation);
	}

	async function getParsedFEN() {
		const startingPositionFEN =
			"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

		try {
			const fetchedFEN = await fetchFen(startingPositionFEN);
			setParsedFEN(fetchedFEN);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<GameEndedSetterContext.Provider value={setGameEnded}>
			<GameEndedCauseSetterContext.Provider value={setGameEndedCause}>
				<GameWinnerSetterContext.Provider value={setGameWinner}>
					<DashboardNavbar />
					<div className="playing-interface-container">
						<div className="main-chessboard">
							<div className="chessboard-wrapper">
								<Chessboard
									parsed_fen_string={
										parsedFEN as ParsedFENString
									}
									orientation={boardOrientation}
									setBoardOrientation={setBoardOrientation}
									flipOnMove={false}
									squareSize={70}
									gameplaySettings={gameplaySettings}
								/>
							</div>

							<ModalWrapper visible={gameplaySettingsVisible}>
								<GameplaySettings
									onClose={handleSettingsClose}
									setGameplaySettings={setGameplaySettings}
								/>
							</ModalWrapper>

							<LocalGameOverModal
								visible={gameEnded}
								gameEndCause={gameEndedCause}
								gameWinner={gameWinner}
							/>
						</div>

						<div className="board-actions">
							<img
								onClick={toggleBoardOrientation}
								className="flip-board-icon"
								src="/icons/gameplay/boardActions/flip-board-icon.png"
							/>
							<img
								className="settings-icon"
								src="/icons/gameplay/boardActions/settings.svg"
								onClick={handleSettingsDisplay}
							/>
						</div>
					</div>
				</GameWinnerSetterContext.Provider>
			</GameEndedCauseSetterContext.Provider>
		</GameEndedSetterContext.Provider>
	);
}

export default PassAndPlay;
