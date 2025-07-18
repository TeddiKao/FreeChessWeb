import { useState } from "react";

function useBotGameEndState() {
	const [gameWinner, setGameWinner] = useState<string>("");
	const [hasGameEnded, setHasGameEnded] = useState(false);
	const [gameEndedCause, setGameEndedCause] = useState<string>("");

	return {
		gameWinner,
		hasGameEnded,
		gameEndedCause,
		setGameWinner,
		setHasGameEnded,
		setGameEndedCause,
	};
}

export default useBotGameEndState;