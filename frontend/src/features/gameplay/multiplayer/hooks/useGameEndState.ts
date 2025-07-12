import { useState } from "react";
import { getOppositeColor } from "@gameplay/passAndPlay/utils/general";
import { PieceColor } from "@sharedTypes/chessTypes/pieces.types";
import { CheckmateEventData } from "@gameplay/multiplayer/types/gameEvents.types";

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
