import { displayTimeControl } from "@sharedUtils/timeUtils";
import "../styles/matchmaking-screen.scss";
import useMatchmakingLogic from "../hooks/useMatchmakingLogic";

type timeControlInfo = {
	baseTime: number;
	increment: number;
};

type gameSetupStageFunction = (stage: string) => void;

type MatchmakingScreenProps = {
	timeControlInfo: timeControlInfo;
	setGameSetupStage: gameSetupStageFunction;
};

function MatchmakingScreen({
	timeControlInfo: { baseTime, increment },
	setGameSetupStage,
}: MatchmakingScreenProps) {
	const { matchmakingStatus, cancelMatchmaking } = useMatchmakingLogic({
		enabled: true,
		baseTime,
		increment,
		cancelSuccess: handleMatchmakingCancelSuccess,
	});

	function handleMatchmakingCancelSuccess(): void {
		setGameSetupStage("timeControlSelection");
	}

	return (
		<div className="matchmaking-screen-container">
			<h1 className="matchmaking-heading">{matchmakingStatus}</h1>
			<p className="matchmaking-time-control">
				{displayTimeControl({ baseTime, increment })}
			</p>
			<button onClick={cancelMatchmaking} className="cancel-matchmaking">
				Cancel
			</button>
		</div>
	);
}

export default MatchmakingScreen;
