import useBotGameEndState from "./useBotGameEndState";

function useBotGameplayLogic() {
    const {
        hasGameEnded,
        gameEndedCause,
        gameWinner,
        setHasGameEnded,
        setGameWinner,
        setGameEndedCause,
    } = useBotGameEndState();
}

export default useBotGameplayLogic;
