import { useState } from "react";
import { PieceColor } from "../../types/gameLogic";
import { CheckmateEventData } from "../../interfaces/gameLogic";
import { getOppositeColor } from "../../utils/gameLogic/general";

function useGameEndState() {
	const [hasGameEnded, setHasGameEnded] = useState<boolean>(false);
	const [gameEndedCause, setGameEndedCause] = useState<string>("");
	const [gameWinner, setGameWinner] = useState<PieceColor | "">("");

	function handleDraw(drawCause: string) {
		setHasGameEnded(true);
		setGameEndedCause(drawCause);
	}

	function handleCheckmate(eventData: CheckmateEventData) {
		setHasGameEnded(true);
		setGameEndedCause("Checkmate");
		setGameWinner(eventData["winning_color"] as PieceColor);
	}

    function handlePlayerTimeout(eventData: any) {
		setHasGameEnded(true);
		setGameEndedCause("Timeout");
		setGameWinner(getOppositeColor(eventData["timeout_color"]));
	}

	return {
		hasGameEnded,
		setHasGameEnded,
		gameEndedCause,
		setGameEndedCause,
		gameWinner,
        setGameWinner,

        handleDraw,
        handleCheckmate,
        handlePlayerTimeout,
	};
}

export default useGameEndState;
