import { useState } from "react";
import { PieceColor } from "../../types/gameLogic";

function useGameEndState() {
    const [hasGameEnded, setHasGameEnded] = useState<boolean>(false);
	const [gameEndedCause, setGameEndedCause] = useState<string>("");
	const [gameWinner, setGameWinner] = useState<PieceColor | "">("");
}

export default useGameEndState;