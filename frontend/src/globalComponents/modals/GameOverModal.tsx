import { useRef, useState } from "react";
import "../../styles/modals/game-over-modal.scss";
import { capitaliseFirstLetter, parseWebsocketUrl } from "../../utils/generalUtils";
import useWebSocket from "../../hooks/useWebsocket";
import { TimeControl } from "../../types/gameSetup";
import { useNavigate } from "react-router-dom";

type GameOverModalProps = {
    visible: boolean,
    gameEndCause: string,
    gameWinner: string | null,
    timeControlInfo: TimeControl
}

function GameOverModal({ visible, gameEndCause, gameWinner, timeControlInfo }: GameOverModalProps) {
    const [matchmakingWebsocketEnabled, setMatchmakingWebsocketEnabled] = useState(false);
    
    const navigate = useNavigate();

    const websocketUrl = parseWebsocketUrl("matchmaking-server", {
        baseTime: timeControlInfo.baseTime,
        increment: timeControlInfo.increment,
    })

    const matchmakingWebsocket = useWebSocket(websocketUrl, handleOnMessage, undefined, matchmakingWebsocketEnabled);
    const matchmakingWebsocketRef = useRef(matchmakingWebsocket);

    function handleOnMessage() {

    }
    
    if (!visible) {
        return null;
    }

    const gameResultText = !gameWinner
        ? "Draw"
        : `${capitaliseFirstLetter(gameWinner)} won`;
    const gameEndCauseText = capitaliseFirstLetter(gameEndCause);

    function handleNewGameCreation() {
        setMatchmakingWebsocketEnabled(true);
    }

    return (
        <div className="game-over-modal-container">
            <h1 className="game-result">{gameResultText}</h1>
            <p className="game-end-cause">by {gameEndCauseText}</p>
            <div className="buttons-container">
                <button onClick={handleNewGameCreation} className="new-game-button">New game</button>
                <button className="rematch-button">Rematch</button>
            </div>
        </div>
    );
}

export default GameOverModal;
