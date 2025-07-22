import { useState } from "react";
import { PieceColor } from "@sharedTypes/chessTypes/pieces.types";
import { BotCheckmateEventData } from "../types/botGameEvents.types";

function useBotGameEndState() {
	const [hasGameEnded, setHasGameEnded] = useState<boolean>(false);
	const [gameEndedCause, setGameEndedCause] = useState<string>("");
	const [gameWinner, setGameWinner] = useState<PieceColor | "">("");

	function handleDraw(drawCause: string) {
		setHasGameEnded(true);
		setGameEndedCause(drawCause);
	}

	function handleCheckmate(eventData: BotCheckmateEventData) {
		setHasGameEnded(true);
		setGameEndedCause("Checkmate");
		setGameWinner(eventData["winning_color"] as PieceColor);
	}

	return {
		hasGameEnded,
		gameEndedCause,
		gameWinner,
		handleDraw,
		handleCheckmate,

        setHasGameEnded,
        setGameEndedCause,
        setGameWinner,
	};
}

export default useBotGameEndState;