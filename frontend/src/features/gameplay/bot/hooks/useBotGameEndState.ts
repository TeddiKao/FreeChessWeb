import { useState } from "react";

function useBotGameEndState() {
    const [hasGameEnded, setHasGameEnded] = useState<boolean>(false);
    const [gameEndedCause, setGameEndedCause] = useState<string>("");
    const [gameWinner, setGameWinner] = useState<string>("");

    function handleCheckmate({ game_winner: gameWinner }: any) {
        setHasGameEnded(true);
        setGameWinner(gameWinner);
        setGameEndedCause("checkmate");
    }

    function handleDraw(drawCause: string) {
        setHasGameEnded(true);
        setGameEndedCause(drawCause);
    }

    return {
        gameWinner,
        hasGameEnded,
        gameEndedCause,
        setGameWinner,
        setHasGameEnded,
        setGameEndedCause,

        handleCheckmate,
        handleDraw,
    };
}

export default useBotGameEndState;