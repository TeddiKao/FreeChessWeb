import useBotGameEndState from "./useBotGameEndState";

function useBotGameplayLogic() {
    const { hasGameEnded, gameWinner, gameEndedCause } = useBotGameEndState();

    
}

export default useBotGameplayLogic;