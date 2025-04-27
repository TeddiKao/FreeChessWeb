import { useEffect, useState } from "react";
import BotChessboard from "../../globalComponents/chessboards/BotChessboard";
import DashboardNavbar from "../../pageComponents/dashboard/DashboardNavbar";
import { fetchFen } from "../../utils/apiUtils";
import { ParsedFENString, PieceColor } from "../../types/gameLogic";

import "../../styles/pages/play-bot.scss";
import useGameplaySettings from "../../hooks/useGameplaySettings";
import GameplaySettings from "../../globalComponents/modals/GameplaySettings";
import ModalWrapper from "../../globalComponents/wrappers/ModalWrapper";

function PlayBot() {
	const startingFEN =
		"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	const [parsedFEN, setParsedFEN] = useState<ParsedFENString | null>(null);
	const [boardOrientation, setBoardOrientation] = useState<string>("White");

	const initialGameplaySettings = useGameplaySettings();
	const [gameplaySettings, setGameplaySettings] = useState<boolean>(false);
	const [gameplaySettingsVisible, setGameplaySettingsVisible] =
		useState<boolean>(false);

	useEffect(() => {
		updateParsedFEN();
	}, []);

	async function updateParsedFEN() {
		const parsedFEN = await fetchFen(startingFEN);
		setParsedFEN(parsedFEN);
	}

	function toggleBoardOrientation() {
		const newOrientation =
			boardOrientation.toLowerCase() === "white" ? "Black" : "White";
		setBoardOrientation(newOrientation);
	}

	function handleSettingsDisplay() {
		setGameplaySettingsVisible(true);
	}

	function handleSettingsModalClose() {
		setGameplaySettingsVisible(false);
	}

	if (!parsedFEN) {
		return null;
	}

	return (
		<>
			<DashboardNavbar />
			<div className="play-bot-interface-container">
				<div className="bot-chessboard-wrapper">
					<BotChessboard
						squareSize={58}
						parsed_fen_string={parsedFEN}
						orientation={boardOrientation}
					/>
				</div>

				<div className="board-actions">
					<img
						onClick={toggleBoardOrientation}
						className="flip-board-icon"
						src="/flip-board-icon.png"
					/>
					<img
						className="settings-icon"
						src="/settings.svg"
						onClick={handleSettingsDisplay}
					/>
				</div>
			</div>

			<ModalWrapper visible={gameplaySettingsVisible}>
				<GameplaySettings
					onClose={handleSettingsModalClose}
					setGameplaySettings={setGameplaySettings}
				/>
			</ModalWrapper>
		</>
	);
}

export default PlayBot;
