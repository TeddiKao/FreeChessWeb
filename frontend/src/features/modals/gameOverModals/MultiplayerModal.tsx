import { useContext, useEffect, useRef, useState } from "react";
import "../../../styles/modals/game-over-modal.scss";
import { ChallengeWebsocketContext } from "../../../components/wrappers/ChallengeWebsocketProvider";
import useUsername from "../../../hooks/useUsername";
import { capitaliseFirstLetter } from "../../../utils/generalUtils";
import MatchmakingShortcutScreen from "../MatchmakingShortcutScreen";
import { TimeControl } from "../../../types/gameSetup";
import useMatchmakingLogic from "../../../hooks/useMatchmakingLogic";

type GameOverModalProps = {
	visible: boolean;
	gameEndCause: string;
	gameWinner: string | null;
	timeControlInfo: TimeControl;

	whitePlayerUsername: string;
	blackPlayerUsername: string;
};

function GameOverModal({
	visible,
	gameEndCause,
	gameWinner,
	timeControlInfo,
	whitePlayerUsername,
	blackPlayerUsername,
}: GameOverModalProps) {
	const [matchmakingWebsocketEnabled, setMatchmakingWebsocketEnabled] =
		useState(false);
	const [isMatchmaking, setIsMatchmaking] = useState(false);

	const playerUsername = useUsername();
	const playerUsernameRef = useRef<string | null>(playerUsername);

	const { sendChallenge } = useContext(ChallengeWebsocketContext)!;

	useEffect(() => {
		playerUsernameRef.current = playerUsername;
	}, [playerUsername]);

	useMatchmakingLogic({
		baseTime: timeControlInfo.baseTime,
		increment: timeControlInfo.increment,
		cancelSuccess: () => {},
		enabled: matchmakingWebsocketEnabled,
		navigateToTemp: true,
	})

	if (!visible) {
		return null;
	}

	const gameResultText = !gameWinner
		? "Draw"
		: `${capitaliseFirstLetter(gameWinner)} won`;
	const gameEndCauseText = capitaliseFirstLetter(gameEndCause);

	function handleNewGameCreation() {
		setMatchmakingWebsocketEnabled(true);
		setIsMatchmaking(true);
	}

	function handleRematch() {
		const recepientUsername = playerUsername === whitePlayerUsername ? blackPlayerUsername : whitePlayerUsername

		sendChallenge(recepientUsername, "Recent opponent", timeControlInfo);
	}

	return (
		<>
			<div className="game-over-modal-container">
				<h1 className="game-result">{gameResultText}</h1>
				<p className="game-end-cause">by {gameEndCauseText}</p>
				<div className="buttons-container">
					<button
						onClick={handleNewGameCreation}
						className="new-game-button"
					>
						New game
					</button>
					<button onClick={handleRematch} className="rematch-button">
						Rematch
					</button>
				</div>
			</div>

			<MatchmakingShortcutScreen
				timeControlInfo={timeControlInfo}
				visible={isMatchmaking}
			/>
		</>
	);
}

export default GameOverModal;
