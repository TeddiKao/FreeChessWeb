import { useState } from "react";
import { PieceColor } from "../../types/gameLogic";
import { CheckmateEventData } from "../../interfaces/gameLogic";

function useGameEndState() {
    const [hasGameEnded, setHasGameEnded] = useState<boolean>(false);
	const [gameEndedCause, setGameEndedCause] = useState<string>("");
	const [gameWinner, setGameWinner] = useState<PieceColor | "">("");

    function handleStalemate() {
		setHasGameEnded(true);
		setGameEndedCause("Stalemate");
	}

	function handleThreefoldRepetition() {
		setHasGameEnded(true);
		setGameEndedCause("Repetition");
	}

	function handle50MoveRule() {
		setHasGameEnded(true);
		setGameEndedCause("50-move-rule");
	}

	function handleInsufficientMaterial() {
		setHasGameEnded(true);
		setGameEndedCause("Insufficient material");
	}

    function handleDraw(drawCause: string) {
        setHasGameEnded(true);
        setGameEndedCause(drawCause);
    }

	function handleCheckmate(eventData: CheckmateEventData) {
		setHasGameEnded(true);
		setGameEndedCause("Checkmate");
		setGameWinner(eventData["winning_color"] as PieceColor);
	}
}

export default useGameEndState;