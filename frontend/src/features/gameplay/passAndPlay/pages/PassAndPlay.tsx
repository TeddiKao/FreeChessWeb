import React, { useState, useEffect } from "react";

import "../../../../styles/components/chessboard/board-actions.scss";
import "../styles/pass-and-play.scss";

import Chessboard from "../Chessboard.tsx";
import GameplaySettings from "../../../settings/gameplay/GameplaySettings.tsx";
import ModalWrapper from "../../../../components/wrappers/ModalWrapper.tsx";
import useGameplaySettings from "../../../settings/gameplay/hooks/useGameplaySettings.ts";
import DashboardNavbar from "../../../../shared/components/DashboardNavbar/DashboardNavbar.tsx";
import LocalGameOverModal from "../modals/GameOverModal.tsx";
import { ParsedFEN } from "../../common/types/gameState.types.ts";
import { fetchFen } from "../utils/passAndPlayApi.ts";
import {
	GameEndedCauseSetterContext,
	GameEndedSetterContext,
	GameWinnerSetterContext,
} from "../contexts/gameEndStateSetters.ts";

function PassAndPlay() {
	const [parsedFEN, setParsedFEN] = useState<ParsedFEN | null>(null);

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
									parsed_fen_string={parsedFEN as ParsedFEN}
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
