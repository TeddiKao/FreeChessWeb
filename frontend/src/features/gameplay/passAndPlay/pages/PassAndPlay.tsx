import { useState, useEffect } from "react";

import "@sharedStyles/chessboard/board-actions.scss";
import "../styles/pass-and-play.scss";

import Chessboard from "../Chessboard";
import GameplaySettings from "@settings/gameplay/GameplaySettings";
import BaseModal from "@sharedComponents/layout/BaseModal";
import useGameplaySettings from "@settings/gameplay/hooks/useGameplaySettings";
import DashboardNavbar from "@sharedComponents/DashboardNavbar/DashboardNavbar";
import LocalGameOverModal from "../modals/GameOverModal";
import { ParsedFEN } from "@sharedTypes/chessTypes/gameState.types";
import { fetchFen } from "../utils/passAndPlayApi";
import {
	GameEndedCauseSetterContext,
	GameEndedSetterContext,
	GameWinnerSetterContext,
} from "../contexts/gameEndStateSetters";
import BoardActions from "@sharedComponents/chessboard/BoardActions";

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

							<BaseModal visible={gameplaySettingsVisible}>
								<GameplaySettings
									onClose={handleSettingsClose}
									setGameplaySettings={setGameplaySettings}
								/>
							</BaseModal>

							<LocalGameOverModal
								visible={gameEnded}
								gameEndCause={gameEndedCause}
								gameWinner={gameWinner}
							/>
						</div>

						<BoardActions
							toggleBoardOrientation={toggleBoardOrientation}
							displaySettings={handleSettingsDisplay}
						/>
					</div>
				</GameWinnerSetterContext.Provider>
			</GameEndedCauseSetterContext.Provider>
		</GameEndedSetterContext.Provider>
	);
}

export default PassAndPlay;
